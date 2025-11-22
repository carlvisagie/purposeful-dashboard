import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "../_core/trpc";
import { db } from "../db";
import { therapistNetwork, professionalReferrals, insuranceClaims } from "../../drizzle/schema";
import { eq, and, desc } from "drizzle-orm";

export const professionalNetworkRouter = router({
  // Therapist Network Management (Admin)
  addTherapist: protectedProcedure
    .input(z.object({
      name: z.string(),
      specialization: z.string().optional(),
      licenseNumber: z.string().optional(),
      contactEmail: z.string().optional(),
      contactPhone: z.string().optional(),
      acceptsInsurance: z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const [therapist] = await db.insert(therapistNetwork).values({
        name: input.name,
        specialization: input.specialization,
        licenseNumber: input.licenseNumber,
        contactEmail: input.contactEmail,
        contactPhone: input.contactPhone,
        acceptsInsurance: input.acceptsInsurance || false,
      });
      return therapist;
    }),

  getTherapistNetwork: protectedProcedure
    .input(z.object({
      specialization: z.string().optional(),
      acceptsInsurance: z.boolean().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const conditions = [];
      
      if (input.specialization) {
        conditions.push(eq(therapistNetwork.specialization, input.specialization));
      }
      
      if (input.acceptsInsurance !== undefined) {
        conditions.push(eq(therapistNetwork.acceptsInsurance, input.acceptsInsurance));
      }

      if (conditions.length === 0) {
        return await db.select().from(therapistNetwork)
          .orderBy(desc(therapistNetwork.createdAt));
      }

      return await db.select().from(therapistNetwork)
        .where(and(...conditions))
        .orderBy(desc(therapistNetwork.createdAt));
    }),

  updateTherapistAvailability: protectedProcedure
    .input(z.object({
      id: z.number(),
      availabilityStatus: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      await db.update(therapistNetwork)
        .set({ availabilityStatus: input.availabilityStatus })
        .where(eq(therapistNetwork.id, input.id));
      return { success: true };
    }),

  // Professional Referral Management
  createReferral: protectedProcedure
    .input(z.object({
      therapistId: z.number().optional(),
      referralType: z.string(),
      urgency: z.enum(["low", "medium", "high", "critical"]),
      reason: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const [referral] = await db.insert(professionalReferrals).values({
        userId: ctx.user.id,
        therapistId: input.therapistId,
        referralType: input.referralType,
        urgency: input.urgency,
        reason: input.reason,
        status: "pending",
      });

      // In a real implementation, this would trigger notifications to the therapist
      return referral;
    }),

  getReferrals: protectedProcedure
    .query(async ({ ctx }) => {
      return await db.select().from(professionalReferrals)
        .where(eq(professionalReferrals.userId, ctx.user.id))
        .orderBy(desc(professionalReferrals.referredAt));
    }),

  updateReferralStatus: protectedProcedure
    .input(z.object({
      id: z.number(),
      status: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const updates: any = { status: input.status };
      
      if (input.status === "completed") {
        updates.completedAt = new Date();
      }

      await db.update(professionalReferrals)
        .set(updates)
        .where(eq(professionalReferrals.id, input.id));
      
      return { success: true };
    }),

  // Insurance Claims Management
  submitInsuranceClaim: protectedProcedure
    .input(z.object({
      sessionId: z.number(),
      insuranceProvider: z.string(),
      claimAmount: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Generate claim number
      const claimNumber = `CLM-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      const [claim] = await db.insert(insuranceClaims).values({
        userId: ctx.user.id,
        sessionId: input.sessionId,
        claimNumber,
        insuranceProvider: input.insuranceProvider,
        claimAmount: input.claimAmount.toString(),
        status: "submitted",
      });

      return claim;
    }),

  getInsuranceClaims: protectedProcedure
    .query(async ({ ctx }) => {
      return await db.select().from(insuranceClaims)
        .where(eq(insuranceClaims.userId, ctx.user.id))
        .orderBy(desc(insuranceClaims.submittedAt));
    }),

  updateClaimStatus: protectedProcedure
    .input(z.object({
      id: z.number(),
      status: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const updates: any = { status: input.status };
      
      if (input.status === "approved" || input.status === "denied") {
        updates.processedAt = new Date();
      }

      await db.update(insuranceClaims)
        .set(updates)
        .where(eq(insuranceClaims.id, input.id));
      
      return { success: true };
    }),

  // Emergency Professional Contact
  requestEmergencyConsultation: protectedProcedure
    .input(z.object({
      urgency: z.enum(["high", "critical"]),
      situation: z.string(),
      preferredSpecialization: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Find available therapists
      const availableTherapists = await db.select().from(therapistNetwork)
        .where(eq(therapistNetwork.availabilityStatus, "available"))
        .limit(5);

      if (availableTherapists.length === 0) {
        return {
          success: false,
          message: "No therapists currently available. Please call emergency services if this is a crisis.",
          emergencyNumbers: {
            suicide: "988",
            crisis: "911",
          },
        };
      }

      // Create referral to first available therapist
      const [referral] = await db.insert(professionalReferrals).values({
        userId: ctx.user.id,
        therapistId: availableTherapists[0].id,
        referralType: "emergency_consultation",
        urgency: input.urgency,
        reason: input.situation,
        status: "urgent",
      });

      return {
        success: true,
        message: "Emergency consultation requested",
        therapist: availableTherapists[0],
        referral,
      };
    }),

  // Therapist Matching Algorithm
  findMatchingTherapist: protectedProcedure
    .input(z.object({
      specialization: z.string().optional(),
      acceptsInsurance: z.boolean().optional(),
      urgency: z.enum(["low", "medium", "high"]).optional(),
    }))
    .query(async ({ ctx, input }) => {
      const conditions = [eq(therapistNetwork.availabilityStatus, "available")];
      
      if (input.specialization) {
        conditions.push(eq(therapistNetwork.specialization, input.specialization));
      }
      
      if (input.acceptsInsurance !== undefined) {
        conditions.push(eq(therapistNetwork.acceptsInsurance, input.acceptsInsurance));
      }

      const matches = await db.select().from(therapistNetwork)
        .where(and(...conditions))
        .limit(10);

      return {
        matches,
        count: matches.length,
        message: matches.length > 0 
          ? `Found ${matches.length} matching therapist(s)` 
          : "No matching therapists found. Try adjusting your criteria.",
      };
    }),
});
