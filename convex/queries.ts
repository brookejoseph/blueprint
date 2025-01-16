import { query } from "./_generated/server";
import { v } from "convex/values";

export const getRoutine = query({
  args: { routineId: v.id("routines") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.routineId);
  },
});

export const getUserMetrics = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const metrics = await ctx.db
      .query("metrics")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .order("desc")
      .take(100);
    return metrics;
  },
});

export const getUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});

export const getProtocolSections = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("protocolSections").collect();
  },
});
