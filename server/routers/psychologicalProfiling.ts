import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { db } from "../db";
import { nlpPatterns, microExpressions, personalityAssessments, behavioralBaselines, cognitiveBiases } from "../../drizzle/schema";
import { eq, and, desc } from "drizzle-orm";

export const psychologicalProfilingRouter = router({
  // NLP Pattern Detection
  createNLPPattern: protectedProcedure
    .input(z.object({
      patternType: z.string(),
      pattern: z.string(),
      context: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const [pattern] = await db.insert(nlpPatterns).values({
        userId: ctx.user.id,
        patternType: input.patternType,
        pattern: input.pattern,
        context: input.context,
        frequency: 1,
      });
      return pattern;
    }),

  getNLPPatterns: protectedProcedure
    .query(async ({ ctx }) => {
      return await db.select().from(nlpPatterns)
        .where(eq(nlpPatterns.userId, ctx.user.id))
        .orderBy(desc(nlpPatterns.detectedAt));
    }),

  // Micro-Expression Detection
  logMicroExpression: protectedProcedure
    .input(z.object({
      sessionId: z.number().optional(),
      expression: z.string(),
      intensity: z.number().min(1).max(10),
      context: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const [expression] = await db.insert(microExpressions).values({
        userId: ctx.user.id,
        sessionId: input.sessionId,
        expression: input.expression,
        intensity: input.intensity,
        context: input.context,
      });
      return expression;
    }),

  getMicroExpressions: protectedProcedure
    .input(z.object({
      sessionId: z.number().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const conditions = [eq(microExpressions.userId, ctx.user.id)];
      if (input.sessionId) {
        conditions.push(eq(microExpressions.sessionId, input.sessionId));
      }
      return await db.select().from(microExpressions)
        .where(and(...conditions))
        .orderBy(desc(microExpressions.timestamp));
    }),

  // Personality Assessment
  createPersonalityAssessment: protectedProcedure
    .input(z.object({
      assessmentType: z.string(),
      results: z.record(z.any()),
      interpretation: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const [assessment] = await db.insert(personalityAssessments).values({
        userId: ctx.user.id,
        assessmentType: input.assessmentType,
        results: input.results,
        interpretation: input.interpretation,
      });
      return assessment;
    }),

  getPersonalityAssessments: protectedProcedure
    .query(async ({ ctx }) => {
      return await db.select().from(personalityAssessments)
        .where(eq(personalityAssessments.userId, ctx.user.id))
        .orderBy(desc(personalityAssessments.completedAt));
    }),

  // Behavioral Baseline
  createBehavioralBaseline: protectedProcedure
    .input(z.object({
      behaviorType: z.string(),
      baselineValue: z.number(),
      unit: z.string(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const [baseline] = await db.insert(behavioralBaselines).values({
        userId: ctx.user.id,
        behaviorType: input.behaviorType,
        baselineValue: input.baselineValue,
        unit: input.unit,
        notes: input.notes,
      });
      return baseline;
    }),

  getBehavioralBaselines: protectedProcedure
    .query(async ({ ctx }) => {
      return await db.select().from(behavioralBaselines)
        .where(eq(behavioralBaselines.userId, ctx.user.id))
        .orderBy(desc(behavioralBaselines.establishedAt));
    }),

  // Cognitive Bias Detection
  detectCognitiveBias: protectedProcedure
    .input(z.object({
      biasType: z.string(),
      description: z.string(),
      severity: z.enum(["low", "medium", "high"]),
      context: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const [bias] = await db.insert(cognitiveBiases).values({
        userId: ctx.user.id,
        biasType: input.biasType,
        description: input.description,
        severity: input.severity,
        context: input.context,
      });
      return bias;
    }),

  getCognitiveBiases: protectedProcedure
    .query(async ({ ctx }) => {
      return await db.select().from(cognitiveBiases)
        .where(eq(cognitiveBiases.userId, ctx.user.id))
        .orderBy(desc(cognitiveBiases.detectedAt));
    }),
});
