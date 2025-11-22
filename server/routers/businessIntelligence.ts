import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { db } from "../db";
import { revenueMetrics, userCohorts, subscriptions, users } from "../../drizzle/schema";
import { eq, gte, lte, and, desc, sql } from "drizzle-orm";

export const businessIntelligenceRouter = router({
  // Get revenue metrics
  getRevenueMetrics: protectedProcedure
    .input(z.object({
      startDate: z.string(),
      endDate: z.string(),
    }))
    .query(async ({ input }) => {
      const metrics = await db.select()
        .from(revenueMetrics)
        .where(and(
          gte(revenueMetrics.date, input.startDate),
          lte(revenueMetrics.date, input.endDate)
        ))
        .orderBy(revenueMetrics.date);
      
      return metrics;
    }),

  // Calculate and save daily revenue metrics
  calculateDailyMetrics: protectedProcedure
    .input(z.object({
      date: z.string(),
    }))
    .mutation(async ({ input }) => {
      // Get active subscriptions for the date
      const activeSubscriptionsList = await db.select()
        .from(subscriptions)
        .where(and(
          lte(subscriptions.startDate, input.date),
          sql`(${subscriptions.endDate} IS NULL OR ${subscriptions.endDate} >= ${input.date})`
        ));

      const activeCount = activeSubscriptionsList.length;
      const mrr = activeSubscriptionsList.reduce((sum, sub) => sum + (sub.amount || 0), 0);
      const arr = mrr * 12;

      // Check if metrics already exist for this date
      const existing = await db.select()
        .from(revenueMetrics)
        .where(eq(revenueMetrics.date, input.date))
        .limit(1);

      if (existing.length > 0) {
        // Update
        await db.update(revenueMetrics)
          .set({
            mrr,
            arr,
            activeSubscriptions: activeCount,
          })
          .where(eq(revenueMetrics.date, input.date));
      } else {
        // Insert
        await db.insert(revenueMetrics).values({
          date: input.date,
          mrr,
          arr,
          activeSubscriptions: activeCount,
        });
      }

      return { mrr, arr, activeSubscriptions: activeCount };
    }),

  // Get cohort analysis
  getCohortAnalysis: protectedProcedure
    .input(z.object({
      startDate: z.string(),
      endDate: z.string(),
    }))
    .query(async ({ input }) => {
      const cohorts = await db.select()
        .from(userCohorts)
        .where(and(
          gte(userCohorts.cohortDate, input.startDate),
          lte(userCohorts.cohortDate, input.endDate)
        ))
        .orderBy(userCohorts.cohortDate);
      
      return cohorts;
    }),

  // Add user to cohort
  addToCohort: protectedProcedure
    .input(z.object({
      userId: z.number(),
      cohortDate: z.string(),
      acquisitionChannel: z.string().optional(),
      initialPlan: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      await db.insert(userCohorts).values(input);
      return { success: true };
    }),

  // Get churn rate
  getChurnRate: protectedProcedure
    .input(z.object({
      startDate: z.string(),
      endDate: z.string(),
    }))
    .query(async ({ input }) => {
      // Get subscriptions that started before the period
      const startingSubscriptions = await db.select()
        .from(subscriptions)
        .where(lte(subscriptions.startDate, input.startDate));

      // Get subscriptions that ended during the period
      const churnedSubscriptions = await db.select()
        .from(subscriptions)
        .where(and(
          gte(subscriptions.endDate, input.startDate),
          lte(subscriptions.endDate, input.endDate)
        ));

      const churnRate = startingSubscriptions.length > 0
        ? (churnedSubscriptions.length / startingSubscriptions.length) * 100
        : 0;

      return {
        startingSubscriptions: startingSubscriptions.length,
        churnedSubscriptions: churnedSubscriptions.length,
        churnRate: Math.round(churnRate * 100) / 100,
      };
    }),

  // Get customer lifetime value
  getLifetimeValue: protectedProcedure
    .query(async () => {
      // Calculate average subscription duration and value
      const allSubscriptions = await db.select().from(subscriptions);
      
      let totalRevenue = 0;
      let totalMonths = 0;
      let count = 0;

      for (const sub of allSubscriptions) {
        if (sub.startDate && sub.amount) {
          const start = new Date(sub.startDate);
          const end = sub.endDate ? new Date(sub.endDate) : new Date();
          const months = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30);
          
          totalRevenue += sub.amount * months;
          totalMonths += months;
          count++;
        }
      }

      const avgLTV = count > 0 ? totalRevenue / count : 0;
      const avgDuration = count > 0 ? totalMonths / count : 0;

      return {
        averageLifetimeValue: Math.round(avgLTV * 100) / 100,
        averageDurationMonths: Math.round(avgDuration * 10) / 10,
        totalCustomers: count,
      };
    }),
});
