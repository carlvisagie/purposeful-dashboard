import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { db } from "../db";
import { crisisEvents, emergencyContacts } from "../../drizzle/schema";
import { eq, and, desc } from "drizzle-orm";
import { sendEmail } from "../_core/notification";

export const crisisManagementRouter = router({
  // Detect and log crisis event
  detectCrisis: protectedProcedure
    .input(z.object({
      clientId: z.number(),
      severity: z.enum(["medium", "high", "critical"]),
      triggerType: z.string(),
      triggerData: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      // Log crisis event
      const [crisisEvent] = await db.insert(crisisEvents).values({
        clientId: input.clientId,
        severity: input.severity,
        triggerType: input.triggerType,
        triggerData: input.triggerData,
        actionsTaken: JSON.stringify([]),
        notificationsSent: JSON.stringify([]),
      }).returning();

      // Get emergency contacts
      const contacts = await db.select()
        .from(emergencyContacts)
        .where(and(
          eq(emergencyContacts.clientId, input.clientId),
          eq(emergencyContacts.notifyOnCrisis, true)
        ));

      // Send notifications for high and critical severity
      if (input.severity === "high" || input.severity === "critical") {
        const notificationsSent = [];
        
        for (const contact of contacts) {
          if (contact.email) {
            try {
              await sendEmail({
                to: contact.email,
                subject: `Crisis Alert: ${contact.name}`,
                text: `This is an automated crisis alert from Purposeful Live Coaching.\n\nA ${input.severity} severity crisis event has been detected for your contact.\n\nPlease reach out to them immediately.\n\nIf this is a life-threatening emergency, please call 911 or the National Suicide Prevention Lifeline at 988.`,
                html: `
                  <h2>Crisis Alert</h2>
                  <p>This is an automated crisis alert from Purposeful Live Coaching.</p>
                  <p>A <strong>${input.severity}</strong> severity crisis event has been detected for your contact.</p>
                  <p><strong>Please reach out to them immediately.</strong></p>
                  <p>If this is a life-threatening emergency, please call <strong>911</strong> or the National Suicide Prevention Lifeline at <strong>988</strong>.</p>
                `,
              });
              notificationsSent.push({
                contact: contact.name,
                email: contact.email,
                sentAt: new Date().toISOString(),
              });
            } catch (error) {
              console.error(`Failed to send crisis notification to ${contact.email}:`, error);
            }
          }
        }

        // Update crisis event with notifications sent
        await db.update(crisisEvents)
          .set({
            notificationsSent: JSON.stringify(notificationsSent),
            actionsTaken: JSON.stringify([
              { action: "emergency_contacts_notified", timestamp: new Date().toISOString() }
            ]),
          })
          .where(eq(crisisEvents.id, crisisEvent.id));
      }

      return {
        success: true,
        crisisEventId: crisisEvent.id,
        notificationsSent: contacts.length,
      };
    }),

  // Get crisis history
  getCrisisHistory: protectedProcedure
    .input(z.object({
      clientId: z.number(),
      limit: z.number().optional().default(50),
    }))
    .query(async ({ input }) => {
      const events = await db.select()
        .from(crisisEvents)
        .where(eq(crisisEvents.clientId, input.clientId))
        .orderBy(desc(crisisEvents.detectedAt))
        .limit(input.limit);

      return events;
    }),

  // Resolve crisis event
  resolveCrisis: protectedProcedure
    .input(z.object({
      crisisEventId: z.number(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      await db.update(crisisEvents)
        .set({
          resolvedAt: new Date(),
          notes: input.notes,
        })
        .where(eq(crisisEvents.id, input.crisisEventId));

      return { success: true };
    }),
});
