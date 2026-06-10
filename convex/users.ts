import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// All users, newest first. Used by the admin Users table.
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("users").order("desc").collect();
  },
});

// Toggle a user's role between "customer" and "admin".
// NOTE: not yet auth-gated — see the note in convex/products.ts. Add an admin
// role check here once Clerk is wired so a non-admin can't promote themselves.
export const updateRole = mutation({
  args: {
    id: v.id("users"),
    role: v.union(v.literal("customer"), v.literal("admin")),
  },
  handler: async (ctx, { id, role }) => {
    await ctx.db.patch(id, { role });
    return id;
  },
});
