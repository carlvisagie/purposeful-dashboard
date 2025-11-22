import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { db } from "../db";
import { userPoints, achievements, userAchievements, streaks } from "../../drizzle/schema";
import { eq, and, desc } from "drizzle-orm";

export const gamificationRouter = router({
  // Get user points and level
  getPoints: protectedProcedure
    .input(z.object({
      userId: z.number(),
    }))
    .query(async ({ input }) => {
      const [points] = await db.select()
        .from(userPoints)
        .where(eq(userPoints.userId, input.userId))
        .limit(1);
      
      if (!points) {
        // Initialize points for new user
        const [newPoints] = await db.insert(userPoints).values({
          userId: input.userId,
          points: 0,
          level: 1,
        }).returning();
        return newPoints;
      }
      
      return points;
    }),

  // Add points
  addPoints: protectedProcedure
    .input(z.object({
      userId: z.number(),
      points: z.number(),
      reason: z.string(),
    }))
    .mutation(async ({ input }) => {
      const current = await db.select()
        .from(userPoints)
        .where(eq(userPoints.userId, input.userId))
        .limit(1);

      if (current.length === 0) {
        // Initialize
        await db.insert(userPoints).values({
          userId: input.userId,
          points: input.points,
          level: 1,
        });
      } else {
        const newPoints = current[0].points + input.points;
        const newLevel = Math.floor(newPoints / 1000) + 1; // Level up every 1000 points

        await db.update(userPoints)
          .set({
            points: newPoints,
            level: newLevel,
            updatedAt: new Date(),
          })
          .where(eq(userPoints.userId, input.userId));
      }

      return { success: true };
    }),

  // Get all achievements
  getAllAchievements: protectedProcedure
    .query(async () => {
      const allAchievements = await db.select().from(achievements);
      return allAchievements;
    }),

  // Get user achievements
  getUserAchievements: protectedProcedure
    .input(z.object({
      userId: z.number(),
    }))
    .query(async ({ input }) => {
      const earned = await db.select({
        achievement: achievements,
        earnedAt: userAchievements.earnedAt,
      })
        .from(userAchievements)
        .innerJoin(achievements, eq(userAchievements.achievementId, achievements.id))
        .where(eq(userAchievements.userId, input.userId))
        .orderBy(desc(userAchievements.earnedAt));
      
      return earned;
    }),

  // Award achievement
  awardAchievement: protectedProcedure
    .input(z.object({
      userId: z.number(),
      achievementId: z.number(),
    }))
    .mutation(async ({ input }) => {
      // Check if already earned
      const existing = await db.select()
        .from(userAchievements)
        .where(and(
          eq(userAchievements.userId, input.userId),
          eq(userAchievements.achievementId, input.achievementId)
        ))
        .limit(1);

      if (existing.length > 0) {
        return { success: false, message: "Achievement already earned" };
      }

      // Award achievement
      await db.insert(userAchievements).values({
        userId: input.userId,
        achievementId: input.achievementId,
      });

      // Get achievement details for points
      const [achievement] = await db.select()
        .from(achievements)
        .where(eq(achievements.id, input.achievementId))
        .limit(1);

      // Add points
      if (achievement && achievement.pointValue > 0) {
        const current = await db.select()
          .from(userPoints)
          .where(eq(userPoints.userId, input.userId))
          .limit(1);

        if (current.length > 0) {
          const newPoints = current[0].points + achievement.pointValue;
          const newLevel = Math.floor(newPoints / 1000) + 1;

          await db.update(userPoints)
            .set({
              points: newPoints,
              level: newLevel,
              updatedAt: new Date(),
            })
            .where(eq(userPoints.userId, input.userId));
        }
      }

      return { success: true, achievement };
    }),

  // Get streaks
  getStreaks: protectedProcedure
    .input(z.object({
      userId: z.number(),
    }))
    .query(async ({ input }) => {
      const userStreaks = await db.select()
        .from(streaks)
        .where(eq(streaks.userId, input.userId));
      
      return userStreaks;
    }),

  // Update streak
  updateStreak: protectedProcedure
    .input(z.object({
      userId: z.number(),
      activityType: z.string(),
    }))
    .mutation(async ({ input }) => {
      const today = new Date().toISOString().split('T')[0];
      
      const [existing] = await db.select()
        .from(streaks)
        .where(and(
          eq(streaks.userId, input.userId),
          eq(streaks.activityType, input.activityType)
        ))
        .limit(1);

      if (!existing) {
        // Create new streak
        await db.insert(streaks).values({
          userId: input.userId,
          activityType: input.activityType,
          currentStreak: 1,
          longestStreak: 1,
          lastActivityDate: today,
        });
        return { currentStreak: 1, longestStreak: 1 };
      }

      const lastDate = existing.lastActivityDate;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      let newCurrentStreak = existing.currentStreak;
      
      if (lastDate === yesterdayStr) {
        // Consecutive day
        newCurrentStreak = existing.currentStreak + 1;
      } else if (lastDate === today) {
        // Already logged today
        return { currentStreak: existing.currentStreak, longestStreak: existing.longestStreak };
      } else {
        // Streak broken
        newCurrentStreak = 1;
      }

      const newLongestStreak = Math.max(newCurrentStreak, existing.longestStreak);

      await db.update(streaks)
        .set({
          currentStreak: newCurrentStreak,
          longestStreak: newLongestStreak,
          lastActivityDate: today,
          updatedAt: new Date(),
        })
        .where(and(
          eq(streaks.userId, input.userId),
          eq(streaks.activityType, input.activityType)
        ));

      return { currentStreak: newCurrentStreak, longestStreak: newLongestStreak };
    }),
});
