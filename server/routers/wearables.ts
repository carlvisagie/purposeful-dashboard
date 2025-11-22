import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { db } from "../db";
import { wearableDevices, healthMetrics } from "../../drizzle/schema";
import { eq, and, desc, gte } from "drizzle-orm";

export const wearablesRouter = router({
  // Connect wearable device
  connectDevice: protectedProcedure
    .input(z.object({
      userId: z.number(),
      deviceType: z.enum(["apple_watch", "fitbit", "oura_ring", "other"]),
      deviceId: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const [device] = await db.insert(wearableDevices).values({
        userId: input.userId,
        deviceType: input.deviceType,
        deviceId: input.deviceId,
        isActive: true,
        lastSyncAt: new Date(),
      }).returning();

      return device;
    }),

  // Get connected devices
  getDevices: protectedProcedure
    .input(z.object({
      userId: z.number(),
    }))
    .query(async ({ input }) => {
      const devices = await db.select()
        .from(wearableDevices)
        .where(eq(wearableDevices.userId, input.userId));
      
      return devices;
    }),

  // Disconnect device
  disconnectDevice: protectedProcedure
    .input(z.object({
      deviceId: z.number(),
    }))
    .mutation(async ({ input }) => {
      await db.update(wearableDevices)
        .set({ isActive: false })
        .where(eq(wearableDevices.id, input.deviceId));
      
      return { success: true };
    }),

  // Sync health metrics
  syncMetrics: protectedProcedure
    .input(z.object({
      userId: z.number(),
      deviceId: z.number(),
      metrics: z.array(z.object({
        metricDate: z.string(),
        heartRate: z.number().optional(),
        hrv: z.number().optional(),
        steps: z.number().optional(),
        sleepDuration: z.number().optional(),
        sleepQuality: z.number().optional(),
        restingHeartRate: z.number().optional(),
        activeMinutes: z.number().optional(),
        calories: z.number().optional(),
      })),
    }))
    .mutation(async ({ input }) => {
      // Insert metrics
      for (const metric of input.metrics) {
        await db.insert(healthMetrics).values({
          userId: input.userId,
          deviceId: input.deviceId,
          metricDate: new Date(metric.metricDate),
          ...metric,
        });
      }

      // Update last sync time
      await db.update(wearableDevices)
        .set({ lastSyncAt: new Date() })
        .where(eq(wearableDevices.id, input.deviceId));

      return { success: true, metricsCount: input.metrics.length };
    }),

  // Get health metrics
  getMetrics: protectedProcedure
    .input(z.object({
      userId: z.number(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      limit: z.number().optional().default(100),
    }))
    .query(async ({ input }) => {
      let query = db.select()
        .from(healthMetrics)
        .where(eq(healthMetrics.userId, input.userId))
        .orderBy(desc(healthMetrics.metricDate))
        .limit(input.limit);

      if (input.startDate) {
        query = query.where(gte(healthMetrics.metricDate, new Date(input.startDate)));
      }

      const metrics = await query;
      return metrics;
    }),

  // Get latest metrics summary
  getLatestSummary: protectedProcedure
    .input(z.object({
      userId: z.number(),
    }))
    .query(async ({ input }) => {
      const [latest] = await db.select()
        .from(healthMetrics)
        .where(eq(healthMetrics.userId, input.userId))
        .orderBy(desc(healthMetrics.metricDate))
        .limit(1);
      
      return latest || null;
    }),
});
