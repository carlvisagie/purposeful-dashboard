import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { db } from "../db";
import { environmentalMetrics, sleepEnvironment } from "../../drizzle/schema";
import { eq, and, desc, gte } from "drizzle-orm";

export const environmentalHealthRouter = router({
  // Environmental Metrics Logging
  logEnvironmentalMetric: protectedProcedure
    .input(z.object({
      metricType: z.string(),
      value: z.number(),
      unit: z.string(),
      location: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const [metric] = await db.insert(environmentalMetrics).values({
        userId: ctx.user.id,
        metricType: input.metricType,
        value: input.value.toString(),
        unit: input.unit,
        location: input.location,
      });
      return metric;
    }),

  getEnvironmentalMetrics: protectedProcedure
    .input(z.object({
      metricType: z.string().optional(),
      startDate: z.string().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const conditions = [eq(environmentalMetrics.userId, ctx.user.id)];
      
      if (input.metricType) {
        conditions.push(eq(environmentalMetrics.metricType, input.metricType));
      }
      
      if (input.startDate) {
        conditions.push(gte(environmentalMetrics.recordedAt, new Date(input.startDate)));
      }

      return await db.select().from(environmentalMetrics)
        .where(and(...conditions))
        .orderBy(desc(environmentalMetrics.recordedAt));
    }),

  // Sleep Environment Tracking
  logSleepEnvironment: protectedProcedure
    .input(z.object({
      temperature: z.number().optional(),
      humidity: z.number().optional(),
      lightLevel: z.number().optional(),
      noiseLevel: z.number().optional(),
      airQuality: z.number().optional(),
      sleepQuality: z.number().min(1).max(10).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const [environment] = await db.insert(sleepEnvironment).values({
        userId: ctx.user.id,
        temperature: input.temperature?.toString(),
        humidity: input.humidity?.toString(),
        lightLevel: input.lightLevel,
        noiseLevel: input.noiseLevel,
        airQuality: input.airQuality,
        sleepQuality: input.sleepQuality,
      });
      return environment;
    }),

  getSleepEnvironmentHistory: protectedProcedure
    .input(z.object({
      days: z.number().default(30),
    }))
    .query(async ({ ctx, input }) => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - input.days);

      return await db.select().from(sleepEnvironment)
        .where(and(
          eq(sleepEnvironment.userId, ctx.user.id),
          gte(sleepEnvironment.recordedAt, startDate)
        ))
        .orderBy(desc(sleepEnvironment.recordedAt));
    }),

  // Air Quality Analysis
  getAirQualityAnalysis: protectedProcedure
    .query(async ({ ctx }) => {
      const metrics = await db.select().from(environmentalMetrics)
        .where(and(
          eq(environmentalMetrics.userId, ctx.user.id),
          eq(environmentalMetrics.metricType, "air_quality")
        ))
        .orderBy(desc(environmentalMetrics.recordedAt))
        .limit(100);

      if (metrics.length === 0) {
        return { average: 0, trend: "no_data", recommendations: [] };
      }

      const values = metrics.map(m => parseFloat(m.value));
      const average = values.reduce((a, b) => a + b, 0) / values.length;
      
      // Simple trend analysis
      const recentAvg = values.slice(0, 10).reduce((a, b) => a + b, 0) / Math.min(10, values.length);
      const olderAvg = values.slice(-10).reduce((a, b) => a + b, 0) / Math.min(10, values.length);
      const trend = recentAvg > olderAvg ? "improving" : recentAvg < olderAvg ? "declining" : "stable";

      const recommendations = [];
      if (average < 50) recommendations.push("Consider using an air purifier");
      if (average < 30) recommendations.push("Check for sources of indoor air pollution");
      if (trend === "declining") recommendations.push("Monitor air quality more frequently");

      return { average, trend, recommendations };
    }),

  // Sleep Environment Optimization Recommendations
  getSleepOptimizationRecommendations: protectedProcedure
    .query(async ({ ctx }) => {
      const recentEnvironments = await db.select().from(sleepEnvironment)
        .where(eq(sleepEnvironment.userId, ctx.user.id))
        .orderBy(desc(sleepEnvironment.recordedAt))
        .limit(30);

      if (recentEnvironments.length === 0) {
        return { recommendations: ["Start tracking your sleep environment to get personalized recommendations"] };
      }

      const recommendations = [];
      
      // Temperature analysis
      const temps = recentEnvironments.filter(e => e.temperature).map(e => parseFloat(e.temperature!));
      if (temps.length > 0) {
        const avgTemp = temps.reduce((a, b) => a + b, 0) / temps.length;
        if (avgTemp > 20) recommendations.push("Lower bedroom temperature to 18-20°C for better sleep");
        if (avgTemp < 16) recommendations.push("Increase bedroom temperature to 18-20°C for optimal sleep");
      }

      // Light level analysis
      const lights = recentEnvironments.filter(e => e.lightLevel).map(e => e.lightLevel!);
      if (lights.length > 0) {
        const avgLight = lights.reduce((a, b) => a + b, 0) / lights.length;
        if (avgLight > 10) recommendations.push("Reduce light exposure in bedroom - consider blackout curtains");
      }

      // Noise level analysis
      const noises = recentEnvironments.filter(e => e.noiseLevel).map(e => e.noiseLevel!);
      if (noises.length > 0) {
        const avgNoise = noises.reduce((a, b) => a + b, 0) / noises.length;
        if (avgNoise > 30) recommendations.push("Reduce noise levels - consider white noise machine or earplugs");
      }

      return { recommendations };
    }),
});
