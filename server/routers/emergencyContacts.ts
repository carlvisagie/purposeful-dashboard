import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { db } from "../db";
import { emergencyContacts } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";

export const emergencyContactsRouter = router({
  // Add emergency contact
  addContact: protectedProcedure
    .input(z.object({
      clientId: z.number(),
      name: z.string(),
      relationship: z.string().optional(),
      phone: z.string(),
      email: z.string().email().optional(),
      isPrimary: z.boolean().optional(),
      notifyOnCrisis: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      const [contact] = await db.insert(emergencyContacts).values(input).returning();
      return contact;
    }),

  // Get all emergency contacts for a client
  getContacts: protectedProcedure
    .input(z.object({
      clientId: z.number(),
    }))
    .query(async ({ input }) => {
      const contacts = await db.select()
        .from(emergencyContacts)
        .where(eq(emergencyContacts.clientId, input.clientId));
      
      return contacts;
    }),

  // Update emergency contact
  updateContact: protectedProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().optional(),
      relationship: z.string().optional(),
      phone: z.string().optional(),
      email: z.string().email().optional(),
      isPrimary: z.boolean().optional(),
      notifyOnCrisis: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...updates } = input;
      await db.update(emergencyContacts)
        .set(updates)
        .where(eq(emergencyContacts.id, id));
      
      return { success: true };
    }),

  // Delete emergency contact
  deleteContact: protectedProcedure
    .input(z.object({
      id: z.number(),
    }))
    .mutation(async ({ input }) => {
      await db.delete(emergencyContacts)
        .where(eq(emergencyContacts.id, input.id));
      
      return { success: true };
    }),
});
