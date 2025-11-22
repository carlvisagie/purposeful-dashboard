import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { db } from "../db";
import { healthRecords, medications, labResults } from "../../drizzle/schema";
import { eq, desc } from "drizzle-orm";

export const healthRecordsRouter = router({
  // Add health record
  addRecord: protectedProcedure
    .input(z.object({
      clientId: z.number(),
      recordType: z.string(),
      recordDate: z.string(),
      provider: z.string().optional(),
      diagnosis: z.string().optional(),
      treatment: z.string().optional(),
      medications: z.string().optional(),
      labResults: z.string().optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const [record] = await db.insert(healthRecords).values({
        ...input,
        recordDate: new Date(input.recordDate),
      }).returning();
      
      return record;
    }),

  // Get health records
  getRecords: protectedProcedure
    .input(z.object({
      clientId: z.number(),
      limit: z.number().optional().default(50),
    }))
    .query(async ({ input }) => {
      const records = await db.select()
        .from(healthRecords)
        .where(eq(healthRecords.clientId, input.clientId))
        .orderBy(desc(healthRecords.recordDate))
        .limit(input.limit);
      
      return records;
    }),

  // Add medication
  addMedication: protectedProcedure
    .input(z.object({
      clientId: z.number(),
      medicationName: z.string(),
      dosage: z.string().optional(),
      frequency: z.string().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      prescribedBy: z.string().optional(),
      purpose: z.string().optional(),
      sideEffects: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const [medication] = await db.insert(medications).values({
        ...input,
        startDate: input.startDate ? input.startDate : undefined,
        endDate: input.endDate ? input.endDate : undefined,
      }).returning();
      
      return medication;
    }),

  // Get medications
  getMedications: protectedProcedure
    .input(z.object({
      clientId: z.number(),
      activeOnly: z.boolean().optional().default(true),
    }))
    .query(async ({ input }) => {
      let query = db.select()
        .from(medications)
        .where(eq(medications.clientId, input.clientId));

      if (input.activeOnly) {
        query = query.where(eq(medications.isActive, true));
      }

      const meds = await query;
      return meds;
    }),

  // Update medication
  updateMedication: protectedProcedure
    .input(z.object({
      id: z.number(),
      isActive: z.boolean().optional(),
      endDate: z.string().optional(),
      sideEffects: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...updates } = input;
      await db.update(medications)
        .set(updates)
        .where(eq(medications.id, id));
      
      return { success: true };
    }),

  // Add lab result
  addLabResult: protectedProcedure
    .input(z.object({
      clientId: z.number(),
      testDate: z.string(),
      testName: z.string(),
      result: z.string().optional(),
      unit: z.string().optional(),
      referenceRange: z.string().optional(),
      status: z.enum(["normal", "abnormal", "critical"]).optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const [labResult] = await db.insert(labResults).values({
        ...input,
        testDate: new Date(input.testDate),
      }).returning();
      
      return labResult;
    }),

  // Get lab results
  getLabResults: protectedProcedure
    .input(z.object({
      clientId: z.number(),
      limit: z.number().optional().default(50),
    }))
    .query(async ({ input }) => {
      const results = await db.select()
        .from(labResults)
        .where(eq(labResults.clientId, input.clientId))
        .orderBy(desc(labResults.testDate))
        .limit(input.limit);
      
      return results;
    }),
});
