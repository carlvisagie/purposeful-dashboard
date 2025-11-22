import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { db } from "../db";
import { traumaTimelines, emdrSessions, attachmentStyles, traumaResponses } from "../../drizzle/schema";
import { eq, desc } from "drizzle-orm";

export const traumaCareRouter = router({
  // Trauma Timeline Management
  createTraumaEvent: protectedProcedure
    .input(z.object({
      eventDate: z.string().optional(),
      eventDescription: z.string(),
      impactLevel: z.enum(["low", "medium", "high", "severe"]),
      processingStatus: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const [event] = await db.insert(traumaTimelines).values({
        userId: ctx.user.id,
        eventDate: input.eventDate,
        eventDescription: input.eventDescription,
        impactLevel: input.impactLevel,
        processingStatus: input.processingStatus || "unprocessed",
      });
      return event;
    }),

  getTraumaTimeline: protectedProcedure
    .query(async ({ ctx }) => {
      return await db.select().from(traumaTimelines)
        .where(eq(traumaTimelines.userId, ctx.user.id))
        .orderBy(desc(traumaTimelines.eventDate));
    }),

  updateTraumaEvent: protectedProcedure
    .input(z.object({
      id: z.number(),
      processingStatus: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      await db.update(traumaTimelines)
        .set({ processingStatus: input.processingStatus })
        .where(eq(traumaTimelines.id, input.id));
      return { success: true };
    }),

  // EMDR Session Management
  createEMDRSession: protectedProcedure
    .input(z.object({
      targetMemory: z.string(),
      sudsInitial: z.number().min(0).max(10),
      vocInitial: z.number().min(1).max(7),
      sessionNotes: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const [session] = await db.insert(emdrSessions).values({
        userId: ctx.user.id,
        targetMemory: input.targetMemory,
        sudsInitial: input.sudsInitial,
        vocInitial: input.vocInitial,
        sessionNotes: input.sessionNotes,
      });
      return session;
    }),

  completeEMDRSession: protectedProcedure
    .input(z.object({
      id: z.number(),
      sudsFinal: z.number().min(0).max(10),
      vocFinal: z.number().min(1).max(7),
      sessionNotes: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      await db.update(emdrSessions)
        .set({
          sudsFinal: input.sudsFinal,
          vocFinal: input.vocFinal,
          sessionNotes: input.sessionNotes,
          completedAt: new Date(),
        })
        .where(eq(emdrSessions.id, input.id));
      return { success: true };
    }),

  getEMDRSessions: protectedProcedure
    .query(async ({ ctx }) => {
      return await db.select().from(emdrSessions)
        .where(eq(emdrSessions.userId, ctx.user.id))
        .orderBy(desc(emdrSessions.createdAt));
    }),

  // Attachment Style Assessment
  assessAttachmentStyle: protectedProcedure
    .input(z.object({
      attachmentStyle: z.enum(["secure", "anxious", "avoidant", "disorganized"]),
      assessmentResults: z.record(z.any()),
      notes: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const [assessment] = await db.insert(attachmentStyles).values({
        userId: ctx.user.id,
        attachmentStyle: input.attachmentStyle,
        assessmentResults: input.assessmentResults,
        notes: input.notes,
      });
      return assessment;
    }),

  getAttachmentStyle: protectedProcedure
    .query(async ({ ctx }) => {
      return await db.select().from(attachmentStyles)
        .where(eq(attachmentStyles.userId, ctx.user.id))
        .orderBy(desc(attachmentStyles.assessedAt))
        .limit(1);
    }),

  // Trauma Response Tracking
  logTraumaResponse: protectedProcedure
    .input(z.object({
      trigger: z.string(),
      responseType: z.string(),
      intensity: z.number().min(1).max(10),
      copingStrategy: z.string().optional(),
      effectiveness: z.number().min(1).max(10).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const [response] = await db.insert(traumaResponses).values({
        userId: ctx.user.id,
        trigger: input.trigger,
        responseType: input.responseType,
        intensity: input.intensity,
        copingStrategy: input.copingStrategy,
        effectiveness: input.effectiveness,
      });
      return response;
    }),

  getTraumaResponses: protectedProcedure
    .query(async ({ ctx }) => {
      return await db.select().from(traumaResponses)
        .where(eq(traumaResponses.userId, ctx.user.id))
        .orderBy(desc(traumaResponses.recordedAt));
    }),
});
