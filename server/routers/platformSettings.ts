import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { platformSettings } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export const platformSettingsRouter = router({
  /**
   * Get a platform setting by key
   */
  getSetting: publicProcedure
    .input(
      z.object({
        key: z.string(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;

      const [setting] = await db
        .select()
        .from(platformSettings)
        .where(eq(platformSettings.settingKey, input.key))
        .limit(1);

      return setting || null;
    }),

  /**
   * Get all platform settings
   */
  getAllSettings: protectedProcedure.query(async ({ ctx }) => {
    // Only admins can view all settings
    if (ctx.user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    const db = await getDb();
    if (!db) return [];

    const settings = await db.select().from(platformSettings);
    return settings;
  }),

  /**
   * Update or create a platform setting
   */
  updateSetting: protectedProcedure
    .input(
      z.object({
        key: z.string(),
        value: z.string(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Only admins can update settings
      if (ctx.user.role !== "admin") {
        throw new Error("Unauthorized");
      }

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Check if setting exists
      const [existing] = await db
        .select()
        .from(platformSettings)
        .where(eq(platformSettings.settingKey, input.key))
        .limit(1);

      if (existing) {
        // Update existing setting
        await db
          .update(platformSettings)
          .set({
            settingValue: input.value,
            description: input.description || existing.description,
          })
          .where(eq(platformSettings.settingKey, input.key));
      } else {
        // Create new setting
        await db.insert(platformSettings).values({
          settingKey: input.key,
          settingValue: input.value,
          description: input.description || null,
        });
      }

      return { success: true };
    }),

  /**
   * Check if AI tier is enabled
   */
  isAITierEnabled: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return false;

    const [setting] = await db
      .select()
      .from(platformSettings)
      .where(eq(platformSettings.settingKey, "ai_tier_enabled"))
      .limit(1);

    return setting?.settingValue === "true";
  }),

  /**
   * Toggle AI tier on/off
   */
  toggleAITier: protectedProcedure
    .input(
      z.object({
        enabled: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Only admins can toggle AI tier
      if (ctx.user.role !== "admin") {
        throw new Error("Unauthorized");
      }

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Check if setting exists
      const [existing] = await db
        .select()
        .from(platformSettings)
        .where(eq(platformSettings.settingKey, "ai_tier_enabled"))
        .limit(1);

      if (existing) {
        // Update existing setting
        await db
          .update(platformSettings)
          .set({
            settingValue: input.enabled ? "true" : "false",
          })
          .where(eq(platformSettings.settingKey, "ai_tier_enabled"));
      } else {
        // Create new setting
        await db.insert(platformSettings).values({
          settingKey: "ai_tier_enabled",
          settingValue: input.enabled ? "true" : "false",
          description: "Enable or disable AI coaching tier visibility",
        });
      }

      return { success: true, enabled: input.enabled };
    }),
});
