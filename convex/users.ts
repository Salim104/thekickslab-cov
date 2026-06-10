import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// All users, newest first. Used by the admin Users table.
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("users").order("desc").collect();
  },
});

// Single user by Clerk id, or null. Used to resolve the Convex user record for
// a logged-in Clerk user (account page, cart/wishlist ownership).
export const getByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, { clerkId }) => {
    return await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
      .unique();
  },
});

// Create (or no-op upsert) a Convex user from a Clerk `user.created` webhook.
// Idempotent: if a row with this clerkId already exists we return it instead of
// inserting a duplicate (webhooks can be retried/delivered more than once).
export const createFromClerk = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    name: v.string(),
  },
  handler: async (ctx, { clerkId, email, name }) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
      .unique();
    if (existing) return existing._id;
    return await ctx.db.insert("users", {
      clerkId,
      email,
      name,
      role: "customer",
    });
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
