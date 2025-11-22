import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { db } from "../db";
import { smartDevices, iotAutomations } from "../../drizzle/schema";
import { eq, and, desc } from "drizzle-orm";

export const smartHomeRouter = router({
  // Smart Device Management
  connectDevice: protectedProcedure
    .input(z.object({
      deviceType: z.string(),
      deviceName: z.string(),
      deviceId: z.string(),
      manufacturer: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const [device] = await db.insert(smartDevices).values({
        userId: ctx.user.id,
        deviceType: input.deviceType,
        deviceName: input.deviceName,
        deviceId: input.deviceId,
        manufacturer: input.manufacturer,
        status: "connected",
        lastSync: new Date(),
      });
      return device;
    }),

  getDevices: protectedProcedure
    .query(async ({ ctx }) => {
      return await db.select().from(smartDevices)
        .where(eq(smartDevices.userId, ctx.user.id))
        .orderBy(desc(smartDevices.createdAt));
    }),

  updateDeviceStatus: protectedProcedure
    .input(z.object({
      id: z.number(),
      status: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      await db.update(smartDevices)
        .set({ 
          status: input.status,
          lastSync: new Date(),
        })
        .where(eq(smartDevices.id, input.id));
      return { success: true };
    }),

  disconnectDevice: protectedProcedure
    .input(z.object({
      id: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      await db.delete(smartDevices)
        .where(eq(smartDevices.id, input.id));
      return { success: true };
    }),

  // IoT Automation Management
  createAutomation: protectedProcedure
    .input(z.object({
      deviceId: z.number(),
      triggerType: z.string(),
      triggerCondition: z.string(),
      action: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const [automation] = await db.insert(iotAutomations).values({
        userId: ctx.user.id,
        deviceId: input.deviceId,
        triggerType: input.triggerType,
        triggerCondition: input.triggerCondition,
        action: input.action,
        isActive: true,
      });
      return automation;
    }),

  getAutomations: protectedProcedure
    .query(async ({ ctx }) => {
      return await db.select().from(iotAutomations)
        .where(eq(iotAutomations.userId, ctx.user.id))
        .orderBy(desc(iotAutomations.createdAt));
    }),

  toggleAutomation: protectedProcedure
    .input(z.object({
      id: z.number(),
      isActive: z.boolean(),
    }))
    .mutation(async ({ ctx, input }) => {
      await db.update(iotAutomations)
        .set({ isActive: input.isActive })
        .where(eq(iotAutomations.id, input.id));
      return { success: true };
    }),

  deleteAutomation: protectedProcedure
    .input(z.object({
      id: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      await db.delete(iotAutomations)
        .where(eq(iotAutomations.id, input.id));
      return { success: true };
    }),

  // Smart Home Control Commands
  controlDevice: protectedProcedure
    .input(z.object({
      deviceId: z.number(),
      command: z.string(),
      parameters: z.record(z.any()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      // In a real implementation, this would send commands to actual smart home devices
      // For now, we just log the command and update the device sync time
      
      await db.update(smartDevices)
        .set({ lastSync: new Date() })
        .where(eq(smartDevices.id, input.deviceId));

      return { 
        success: true, 
        message: `Command "${input.command}" sent to device`,
        parameters: input.parameters 
      };
    }),

  // Environment Optimization
  optimizeEnvironment: protectedProcedure
    .input(z.object({
      scenario: z.enum(["sleep", "focus", "relax", "energize"]),
    }))
    .mutation(async ({ ctx, input }) => {
      // Get user's devices
      const devices = await db.select().from(smartDevices)
        .where(eq(smartDevices.userId, ctx.user.id));

      const commands = [];

      // Define optimization scenarios
      const scenarios = {
        sleep: {
          temperature: 18,
          lightLevel: 0,
          soundLevel: "white_noise",
        },
        focus: {
          temperature: 21,
          lightLevel: 80,
          soundLevel: "ambient",
        },
        relax: {
          temperature: 22,
          lightLevel: 40,
          soundLevel: "calm_music",
        },
        energize: {
          temperature: 20,
          lightLevel: 100,
          soundLevel: "upbeat_music",
        },
      };

      const settings = scenarios[input.scenario];

      // Generate commands for each device type
      for (const device of devices) {
        if (device.deviceType === "thermostat") {
          commands.push({
            deviceId: device.id,
            command: "set_temperature",
            value: settings.temperature,
          });
        } else if (device.deviceType === "smart_light") {
          commands.push({
            deviceId: device.id,
            command: "set_brightness",
            value: settings.lightLevel,
          });
        } else if (device.deviceType === "smart_speaker") {
          commands.push({
            deviceId: device.id,
            command: "play",
            value: settings.soundLevel,
          });
        }
      }

      return { 
        success: true, 
        scenario: input.scenario,
        commands,
        message: `Environment optimized for ${input.scenario}` 
      };
    }),
});
