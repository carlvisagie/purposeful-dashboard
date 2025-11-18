import { Router } from "express";
import Stripe from "stripe";
import { ENV } from "../_core/env";
import { getDb } from "../db";
import { subscriptions, users, sessions, clients } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { sendSubscriptionEmail } from "../services/emailService";

const stripe = new Stripe(ENV.stripeSecretKey, {
  apiVersion: "2025-10-29.clover",
});

export const webhookRouter = Router();

/**
 * Stripe Webhook Handler
 * Handles subscription lifecycle events and sends email notifications
 */
webhookRouter.post("/stripe", async (req, res) => {
  const sig = req.headers["stripe-signature"];

  if (!sig) {
    console.error("[Webhook] Missing Stripe signature");
    return res.status(400).send("Missing signature");
  }

  let event: Stripe.Event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      ENV.stripeWebhookSecret
    );
  } catch (err) {
    console.error("[Webhook] Signature verification failed:", err);
    return res.status(400).send(`Webhook Error: \${err instanceof Error ? err.message : 'Unknown error'}`);
  }

  console.log(`[Webhook] Received event: \${event.type}`);

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case "invoice.payment_succeeded":
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case "invoice.payment_failed":
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionCancelled(event.data.object as Stripe.Subscription);
        break;

      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      default:
        console.log(`[Webhook] Unhandled event type: \${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error(`[Webhook] Error processing event \${event.type}:`, error);
    res.status(500).send("Webhook processing failed");
  }
});

// Helper to map Stripe status to our schema
function mapStripeStatus(status: string): "active" | "cancelled" | "past_due" | "unpaid" {
  const statusMap: Record<string, "active" | "cancelled" | "past_due" | "unpaid"> = {
    "active": "active",
    "canceled": "cancelled",
    "cancelled": "cancelled",
    "past_due": "past_due",
    "unpaid": "unpaid",
    "trialing": "active",
    "incomplete": "unpaid",
    "incomplete_expired": "cancelled",
  };
  return statusMap[status] || "active";
}

/**
 * Handle successful checkout session
 * Creates subscription record and sends welcome email
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log("[Webhook] Processing checkout.session.completed");
  console.log("[Webhook] Session mode:", session.mode);
  console.log("[Webhook] Metadata:", session.metadata);

  const db = await getDb();
  if (!db) {
    console.error("[Webhook] Database not available");
    return;
  }

  const userId = session.metadata?.user_id;
  const customerEmail = session.customer_email || session.metadata?.customer_email;
  const customerName = session.metadata?.customer_name;

  if (!userId) {
    console.error("[Webhook] Missing user_id in metadata");
    return;
  }

  // Check if this is a one-time payment (coaching session booking) or subscription
  if (session.mode === 'payment') {
    // ONE-TIME PAYMENT: Create coaching session booking
    await handleSessionBooking(session, db, parseInt(userId));
    return;
  }

  // SUBSCRIPTION: Handle subscription creation
  const productId = session.metadata?.product_id;
  if (!productId) {
    console.error("[Webhook] Missing product_id for subscription");
    return;
  }

  // Get subscription ID from session
  const subscriptionId = session.subscription as string;

  if (!subscriptionId) {
    console.error("[Webhook] No subscription ID in checkout session");
    return;
  }

  // Fetch full subscription details
  const stripeSubscription: any = await stripe.subscriptions.retrieve(subscriptionId);

  // Create subscription record
  await db.insert(subscriptions).values({
    userId: parseInt(userId),
    productId: productId,
    stripeSubscriptionId: subscriptionId,
    stripeCustomerId: session.customer as string,
    stripePriceId: stripeSubscription.items.data[0].price.id,
    status: mapStripeStatus(stripeSubscription.status),
    currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
    currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
  });

  console.log(`[Webhook] Created subscription record for user \${userId}`);

  // Send welcome email
  if (customerEmail) {
    await sendSubscriptionEmail({
      type: "new_subscription",
      to: customerEmail,
      customerName: customerName || "Valued Customer",
      productName: productId,
      amount: stripeSubscription.items.data[0].price.unit_amount || 0,
      subscriptionId: subscriptionId,
    });
  }
}

/**
 * Handle session booking from one-time payment
 * Creates coaching session record after successful payment
 */
async function handleSessionBooking(session: Stripe.Checkout.Session, db: any, userId: number) {
  console.log("[Webhook] Creating session booking for one-time payment");

  const sessionTypeId = session.metadata?.session_type_id;
  const scheduledDate = session.metadata?.scheduled_date;
  const notes = session.metadata?.notes;
  const sessionTypeName = session.metadata?.session_type_name;

  if (!sessionTypeId || !scheduledDate) {
    console.error("[Webhook] Missing session booking metadata");
    return;
  }

  const customerEmail = session.customer_email || session.metadata?.customer_email;
  
  // Get or create client record for this user (lookup by email)
  let clientRecord = customerEmail ? await db
    .select()
    .from(clients)
    .where(eq(clients.email, customerEmail))
    .limit(1) : [];

  let clientId: number;

  if (clientRecord.length === 0) {
    // Create client record
    const [newClient] = await db
      .insert(clients)
      .values({
        coachId: 1, // Default coach ID - adjust if needed
        name: session.metadata?.customer_name || "New Client",
        email: customerEmail || "",
        phone: "",
        status: "active",
      })
      .$returningId();
    clientId = newClient.id;
    console.log("[Webhook] Created new client record:", clientId);
  } else {
    clientId = clientRecord[0].id;
    console.log("[Webhook] Using existing client record:", clientId);
  }

  // Get session type details for duration and price
  const sessionTypeDetails = await db.query.sessionTypes.findFirst({
    where: (sessionTypes: any, { eq }: any) => eq(sessionTypes.id, parseInt(sessionTypeId)),
  });

  // Create session booking
  await db.insert(sessions).values({
    coachId: 1, // Default coach ID - adjust if needed
    clientId: clientId,
    sessionTypeId: parseInt(sessionTypeId),
    scheduledDate: new Date(scheduledDate),
    duration: sessionTypeDetails?.duration || 15,
    price: session.amount_total || 0,
    sessionType: sessionTypeName || "Breakthrough Discovery Session",
    notes: notes || "",
    status: "scheduled",
    paymentStatus: "paid",
    stripePaymentIntentId: session.payment_intent as string,
  });

  console.log("[Webhook] Session booking created successfully");
  console.log("[Webhook] Client ID:", clientId, "Session Type:", sessionTypeName, "Date:", scheduledDate);
}

/**
 * Handle successful payment
 * Sends payment confirmation email
 */
async function handlePaymentSucceeded(invoice: any) {
  console.log("[Webhook] Processing invoice.payment_succeeded");

  const db = await getDb();
  if (!db) return;

  const subscriptionId = invoice.subscription as string;
  if (!subscriptionId) return;

  // Update subscription status
  await db
    .update(subscriptions)
    .set({ status: "active" })
    .where(eq(subscriptions.stripeSubscriptionId, subscriptionId));

  // Get user email
  const subscription = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.stripeSubscriptionId, subscriptionId))
    .limit(1);

  if (subscription.length === 0) return;

  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, subscription[0].userId))
    .limit(1);

  if (user.length === 0 || !user[0].email) return;

  // Send payment confirmation email
  await sendSubscriptionEmail({
    type: "payment_confirmed",
    to: user[0].email,
    customerName: user[0].name || "Valued Customer",
    amount: invoice.amount_paid,
    invoiceUrl: invoice.hosted_invoice_url || undefined,
    subscriptionId: subscriptionId,
  });
}

/**
 * Handle failed payment
 * Sends payment failure notification
 */
async function handlePaymentFailed(invoice: any) {
  console.log("[Webhook] Processing invoice.payment_failed");

  const db = await getDb();
  if (!db) return;

  const subscriptionId = invoice.subscription as string;
  if (!subscriptionId) return;

  // Update subscription status
  await db
    .update(subscriptions)
    .set({ status: "past_due" })
    .where(eq(subscriptions.stripeSubscriptionId, subscriptionId));

  // Get user email
  const subscription = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.stripeSubscriptionId, subscriptionId))
    .limit(1);

  if (subscription.length === 0) return;

  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, subscription[0].userId))
    .limit(1);

  if (user.length === 0 || !user[0].email) return;

  // Send payment failure email
  await sendSubscriptionEmail({
    type: "payment_failed",
    to: user[0].email,
    customerName: user[0].name || "Valued Customer",
    amount: invoice.amount_due,
    invoiceUrl: invoice.hosted_invoice_url || undefined,
    subscriptionId: subscriptionId,
  });
}

/**
 * Handle subscription cancellation
 * Sends cancellation confirmation email
 */
async function handleSubscriptionCancelled(subscription: any) {
  console.log("[Webhook] Processing customer.subscription.deleted");

  const db = await getDb();
  if (!db) return;

  // Update subscription status
  await db
    .update(subscriptions)
    .set({
      status: "cancelled",
      cancelledAt: new Date(),
    })
    .where(eq(subscriptions.stripeSubscriptionId, subscription.id));

  // Get user email
  const subRecord = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.stripeSubscriptionId, subscription.id))
    .limit(1);

  if (subRecord.length === 0) return;

  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, subRecord[0].userId))
    .limit(1);

  if (user.length === 0 || !user[0].email) return;

  // Send cancellation email
  await sendSubscriptionEmail({
    type: "subscription_cancelled",
    to: user[0].email,
    customerName: user[0].name || "Valued Customer",
    subscriptionId: subscription.id,
    cancellationDate: new Date(),
  });
}

/**
 * Handle subscription updates
 * Updates local subscription record
 */
async function handleSubscriptionUpdated(subscription: any) {
  console.log("[Webhook] Processing customer.subscription.updated");

  const db = await getDb();
  if (!db) return;

  await db
    .update(subscriptions)
    .set({
      status: mapStripeStatus(subscription.status),
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    })
    .where(eq(subscriptions.stripeSubscriptionId, subscription.id));
}
