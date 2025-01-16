import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createUser = mutation({
  args: {
    name: v.string(),
    age: v.number(),
    gender: v.string(),
    improvementAreas: v.array(v.string()),
    budget: v.string(),
    equipment: v.array(v.string()),
    currentHealth: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await ctx.db.insert("users", {
      ...args,
      createdAt: Date.now(),
    });
    return userId;
  },
});

export const createRoutine = mutation({
  args: {
    userId: v.id("users"),
    supplements: v.array(v.object({
      name: v.string(),
      dosage: v.string(),
      timing: v.string(),
      cost: v.number(),
      reference: v.optional(v.string()),
    })),
    diet: v.object({
      meals: v.array(v.string()),
      restrictions: v.array(v.string()),
      schedule: v.array(v.string()),
      estimatedCost: v.object({
        daily: v.number(),
        monthly: v.number(),
      }),
      reference: v.optional(v.string()),
    }),
    exercise: v.object({
      type: v.string(),
      frequency: v.string(),
      duration: v.string(),
      requiredEquipment: v.array(v.string()),
      reference: v.optional(v.string()),
    }),
    sleepSchedule: v.object({
      bedtime: v.string(),
      wakeTime: v.string(),
      sleepGoal: v.number(),
      requiredItems: v.array(v.string()),
      reference: v.optional(v.string()),
    }),
    metrics: v.object({
      trackWeight: v.boolean(),
      trackSleep: v.boolean(),
      trackSteps: v.boolean(),
      trackSupplements: v.boolean(),
      reference: v.optional(v.string()),
    }),
    protocolLinks: v.object({
      supplements: v.string(),
      exercise: v.string(),
      diet: v.string(),
      sleep: v.string(),
      testing: v.string(),
    }),
    embeddedSections: v.array(v.object({
      title: v.string(),
      content: v.string(),
      url: v.string(),
    })),
  },
  handler: async (ctx, args) => {
    const routineId = await ctx.db.insert("routines", {
      ...args,
      createdAt: Date.now(),
    });
    return routineId;
  },
});

export const updateMetrics = mutation({
  args: {
    userId: v.id("users"),
    weight: v.optional(v.number()),
    sleepHours: v.optional(v.number()),
    steps: v.optional(v.number()),
    supplements: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const metricId = await ctx.db.insert("metrics", {
      ...args,
      date: Date.now(),
      createdAt: Date.now(),
    });
    return metricId;
  },
});
