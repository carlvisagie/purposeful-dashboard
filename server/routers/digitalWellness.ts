import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { db } from "../db";
import { socialMediaAccounts, screenTimeLogs, digitalWellnessMetrics } from "../../drizzle/schema";
import { eq, and, desc, gte } from "drizzle-orm";

export const digitalWellnessRouter = router({
  // Social Media Account Management
  connectSocialMedia: protectedProcedure
    .input(z.object({
      platform: z.string(),
      accountId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const [account] = await db.insert(socialMediaAccounts).values({
        userId: ctx.user.id,
        platform: input.platform,
        accountId: input.accountId,
        lastSync: new Date(),
      });
      return account;
    }),

  getSocialMediaAccounts: protectedProcedure
    .query(async ({ ctx }) => {
      return await db.select().from(socialMediaAccounts)
        .where(eq(socialMediaAccounts.userId, ctx.user.id))
        .orderBy(desc(socialMediaAccounts.connectedAt));
    }),

  disconnectSocialMedia: protectedProcedure
    .input(z.object({
      id: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      await db.delete(socialMediaAccounts)
        .where(eq(socialMediaAccounts.id, input.id));
      return { success: true };
    }),

  // Screen Time Tracking
  logScreenTime: protectedProcedure
    .input(z.object({
      date: z.string(),
      totalMinutes: z.number(),
      appBreakdown: z.record(z.number()),
      productiveMinutes: z.number().optional(),
      distractingMinutes: z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const [log] = await db.insert(screenTimeLogs).values({
        userId: ctx.user.id,
        date: input.date,
        totalMinutes: input.totalMinutes,
        appBreakdown: input.appBreakdown,
        productiveMinutes: input.productiveMinutes,
        distractingMinutes: input.distractingMinutes,
      });
      return log;
    }),

  getScreenTimeHistory: protectedProcedure
    .input(z.object({
      days: z.number().default(30),
    }))
    .query(async ({ ctx, input }) => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - input.days);

      return await db.select().from(screenTimeLogs)
        .where(and(
          eq(screenTimeLogs.userId, ctx.user.id),
          gte(screenTimeLogs.date, startDate.toISOString().split('T')[0])
        ))
        .orderBy(desc(screenTimeLogs.date));
    }),

  // Digital Wellness Metrics
  logDigitalWellness: protectedProcedure
    .input(z.object({
      date: z.string(),
      wellnessScore: z.number().min(0).max(100),
      socialMediaSentiment: z.number().optional(),
      screenTimeGoalMet: z.boolean().optional(),
      detoxDaysCompleted: z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const [metric] = await db.insert(digitalWellnessMetrics).values({
        userId: ctx.user.id,
        date: input.date,
        wellnessScore: input.wellnessScore,
        socialMediaSentiment: input.socialMediaSentiment?.toString(),
        screenTimeGoalMet: input.screenTimeGoalMet,
        detoxDaysCompleted: input.detoxDaysCompleted || 0,
      });
      return metric;
    }),

  getDigitalWellnessHistory: protectedProcedure
    .input(z.object({
      days: z.number().default(30),
    }))
    .query(async ({ ctx, input }) => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - input.days);

      return await db.select().from(digitalWellnessMetrics)
        .where(and(
          eq(digitalWellnessMetrics.userId, ctx.user.id),
          gte(digitalWellnessMetrics.date, startDate.toISOString().split('T')[0])
        ))
        .orderBy(desc(digitalWellnessMetrics.date));
    }),

  // Screen Time Analysis
  getScreenTimeAnalysis: protectedProcedure
    .query(async ({ ctx }) => {
      const logs = await db.select().from(screenTimeLogs)
        .where(eq(screenTimeLogs.userId, ctx.user.id))
        .orderBy(desc(screenTimeLogs.date))
        .limit(30);

      if (logs.length === 0) {
        return { 
          averageDaily: 0, 
          trend: "no_data", 
          topApps: [],
          recommendations: ["Start tracking your screen time to get insights"] 
        };
      }

      const averageDaily = logs.reduce((sum, log) => sum + log.totalMinutes, 0) / logs.length;
      
      // Trend analysis
      const recentAvg = logs.slice(0, 7).reduce((sum, log) => sum + log.totalMinutes, 0) / Math.min(7, logs.length);
      const olderAvg = logs.slice(-7).reduce((sum, log) => sum + log.totalMinutes, 0) / Math.min(7, logs.length);
      const trend = recentAvg > olderAvg ? "increasing" : recentAvg < olderAvg ? "decreasing" : "stable";

      // Top apps analysis
      const appTotals: Record<string, number> = {};
      logs.forEach(log => {
        if (log.appBreakdown) {
          Object.entries(log.appBreakdown as Record<string, number>).forEach(([app, minutes]) => {
            appTotals[app] = (appTotals[app] || 0) + minutes;
          });
        }
      });
      const topApps = Object.entries(appTotals)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([app, minutes]) => ({ app, minutes }));

      // Recommendations
      const recommendations = [];
      if (averageDaily > 360) recommendations.push("Consider reducing screen time - aim for under 6 hours daily");
      if (trend === "increasing") recommendations.push("Your screen time is increasing - try setting daily limits");
      if (topApps.length > 0 && topApps[0].minutes > averageDaily * 0.5) {
        recommendations.push(`You spend a lot of time on ${topApps[0].app} - consider limiting this app`);
      }

      return { averageDaily, trend, topApps, recommendations };
    }),

  // Digital Detox Challenge
  startDigitalDetox: protectedProcedure
    .input(z.object({
      duration: z.number(), // days
      restrictions: z.array(z.string()),
    }))
    .mutation(async ({ ctx, input }) => {
      // In a real implementation, this would create a challenge and set up notifications
      return {
        success: true,
        message: `Digital detox challenge started for ${input.duration} days`,
        restrictions: input.restrictions,
        startDate: new Date().toISOString(),
      };
    }),

  // Social Media Sentiment Analysis
  analyzeSocialMediaSentiment: protectedProcedure
    .query(async ({ ctx }) => {
      const metrics = await db.select().from(digitalWellnessMetrics)
        .where(eq(digitalWellnessMetrics.userId, ctx.user.id))
        .orderBy(desc(digitalWellnessMetrics.date))
        .limit(30);

      if (metrics.length === 0) {
        return { 
          averageSentiment: 0, 
          trend: "no_data",
          recommendations: ["Connect your social media accounts to track sentiment"] 
        };
      }

      const sentiments = metrics
        .filter(m => m.socialMediaSentiment)
        .map(m => parseFloat(m.socialMediaSentiment!));

      if (sentiments.length === 0) {
        return { 
          averageSentiment: 0, 
          trend: "no_data",
          recommendations: ["Not enough sentiment data available yet"] 
        };
      }

      const averageSentiment = sentiments.reduce((a, b) => a + b, 0) / sentiments.length;
      
      const recentAvg = sentiments.slice(0, 7).reduce((a, b) => a + b, 0) / Math.min(7, sentiments.length);
      const olderAvg = sentiments.slice(-7).reduce((a, b) => a + b, 0) / Math.min(7, sentiments.length);
      const trend = recentAvg > olderAvg ? "improving" : recentAvg < olderAvg ? "declining" : "stable";

      const recommendations = [];
      if (averageSentiment < -0.3) recommendations.push("Your social media sentiment is negative - consider taking a break");
      if (trend === "declining") recommendations.push("Your social media sentiment is declining - monitor your usage");
      if (averageSentiment > 0.5) recommendations.push("Great! Your social media interactions are positive");

      return { averageSentiment, trend, recommendations };
    }),
});
