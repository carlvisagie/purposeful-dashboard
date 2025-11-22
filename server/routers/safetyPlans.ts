import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { db } from "../db";
import { safetyPlans } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export const safetyPlansRouter = router({
  // Create or update safety plan
  savePlan: protectedProcedure
    .input(z.object({
      clientId: z.number(),
      warningSign: z.string().optional(),
      copingStrategy: z.string().optional(),
      socialSupport: z.string().optional(),
      professionalContact: z.string().optional(),
      environmentSafety: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      // Check if plan exists
      const existing = await db.select()
        .from(safetyPlans)
        .where(eq(safetyPlans.clientId, input.clientId))
        .limit(1);

      if (existing.length > 0) {
        // Update existing plan
        await db.update(safetyPlans)
          .set({
            ...input,
            updatedAt: new Date(),
          })
          .where(eq(safetyPlans.clientId, input.clientId));
        
        return { success: true, action: "updated" };
      } else {
        // Create new plan
        await db.insert(safetyPlans).values(input);
        return { success: true, action: "created" };
      }
    }),

  // Get safety plan
  getPlan: protectedProcedure
    .input(z.object({
      clientId: z.number(),
    }))
    .query(async ({ input }) => {
      const [plan] = await db.select()
        .from(safetyPlans)
        .where(eq(safetyPlans.clientId, input.clientId))
        .limit(1);
      
      return plan || null;
    }),
});
