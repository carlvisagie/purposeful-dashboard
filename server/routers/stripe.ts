import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import Stripe from "stripe";
import { ENV } from "../_core/env";
import { getDb } from "../db";
import { subscriptions, sessionTypes } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { PRODUCTS, type ProductId } from "../products";

const stripe = new Stripe(ENV.stripeSecretKey, {
  apiVersion: "2025-10-29.clover",
});

export const stripeRouter = router({
  /**
   * Create Stripe checkout session for coaching session booking
   */
  createSessionCheckout: protectedProcedure
    .input(
      z.object({
        sessionTypeId: z.number(),
        scheduledDate: z.string(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Get session type details
      const [sessionType] = await db
        .select()
        .from(sessionTypes)
        .where(eq(sessionTypes.id, input.sessionTypeId))
        .limit(1);

      if (!sessionType) {
        throw new Error("Session type not found");
      }

      if (!sessionType.stripePriceId) {
        throw new Error("This session type is not available for online purchase. Please contact support.");
      }

      const origin = ctx.req.headers.origin || "http://localhost:3000";

      // Create Stripe checkout session
      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],
        line_items: [
          {
            price: sessionType.stripePriceId,
            quantity: 1,
          },
        ],
        customer_email: ctx.user.email || undefined,
        client_reference_id: ctx.user.id.toString(),
        metadata: {
          user_id: ctx.user.id.toString(),
          customer_email: ctx.user.email || "",
          customer_name: ctx.user.name || "",
          session_type_id: sessionType.id.toString(),
          session_type_name: sessionType.name,
          scheduled_date: input.scheduledDate,
          notes: input.notes || "",
        },
        success_url: `${origin}/my-sessions?payment=success`,
        cancel_url: `${origin}/book-session?payment=cancelled`,
        allow_promotion_codes: true,
      });

      return {
        url: session.url,
        sessionId: session.id,
      };
    }),

  /**
   * Create Stripe checkout session for subscription purchase
   */
  createCheckoutSession: protectedProcedure
    .input(
      z.object({
        productId: z.enum(["STARTER", "PROFESSIONAL"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const product = PRODUCTS[input.productId as ProductId];
      
      if (!product.stripePriceId) {
        throw new Error("Product not available for purchase. Please contact sales.");
      }

      const origin = ctx.req.headers.origin || "http://localhost:3000";

      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],
        line_items: [
          {
            price: product.stripePriceId,
            quantity: 1,
          },
        ],
        customer_email: ctx.user.email || undefined,
        client_reference_id: ctx.user.id.toString(),
        metadata: {
          user_id: ctx.user.id.toString(),
          customer_email: ctx.user.email || "",
          customer_name: ctx.user.name || "",
          product_id: product.id,
        },
        success_url: `${origin}/dashboard?payment=success`,
        cancel_url: `${origin}/dashboard?payment=cancelled`,
        allow_promotion_codes: true,
      });

      return {
        url: session.url,
        sessionId: session.id,
      };
    }),

  /**
   * Get user's active subscriptions
   */
  getSubscriptions: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];

    const userSubs = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, ctx.user.id));

    return userSubs;
  }),

  /**
   * Cancel subscription
   */
  cancelSubscription: protectedProcedure
    .input(
      z.object({
        subscriptionId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Verify subscription belongs to user
      const sub = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.id, parseInt(input.subscriptionId)))
        .limit(1);

      if (sub.length === 0 || sub[0].userId !== ctx.user.id) {
        throw new Error("Subscription not found");
      }

      // Cancel in Stripe
      if (sub[0].stripeSubscriptionId) {
        await stripe.subscriptions.cancel(sub[0].stripeSubscriptionId);
      }

      // Update local record
      await db
        .update(subscriptions)
        .set({
          status: "cancelled",
          cancelledAt: new Date(),
        })
        .where(eq(subscriptions.id, parseInt(input.subscriptionId)));

      return { success: true };
    }),

  /**
   * Get available products
   */
  getProducts: publicProcedure.query(() => {
    return Object.values(PRODUCTS);
  }),
});
