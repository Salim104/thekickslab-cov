import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import type { QueryCtx, MutationCtx } from "./_generated/server";

// Resolve the authenticated caller's Convex user row from their Clerk JWT, or
// throw. `identity.subject` is the Clerk user id, matched against `clerkId`.
async function requireUser(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthorized");
  const user = await ctx.db
    .query("users")
    .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
    .unique();
  if (!user) throw new Error("Unauthorized");
  return user;
}

// Cart rows for a user, each joined to its product. Skips rows whose product was
// since deleted. The `cartId` is the row id so the UI can edit/remove a line.
export const getByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const rows = await ctx.db
      .query("carts")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    const items = await Promise.all(
      rows.map(async (row) => {
        const product = await ctx.db.get(row.productId);
        return product
          ? { cartId: row._id, product, size: row.size, quantity: row.quantity }
          : null;
      })
    );
    return items.filter((i) => i !== null);
  },
});

// Add a product to a user's cart. Merges by user + product + size (increments
// quantity) so the guest→Convex merge on login won't create duplicate lines.
export const addItem = mutation({
  args: {
    userId: v.id("users"),
    productId: v.id("products"),
    size: v.string(),
    quantity: v.number(),
  },
  handler: async (ctx, { userId, productId, size, quantity }) => {
    const caller = await requireUser(ctx);
    if (caller._id !== userId) throw new Error("Unauthorized");
    const rows = await ctx.db
      .query("carts")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    const existing = rows.find(
      (r) => r.productId === productId && r.size === size
    );
    if (existing) {
      await ctx.db.patch(existing._id, {
        quantity: existing.quantity + quantity,
      });
      return existing._id;
    }
    return await ctx.db.insert("carts", { userId, productId, size, quantity });
  },
});

// Set the quantity of a cart line. Removes the line when quantity drops below 1
// (mirrors the guest cartStore's updateQuantity behaviour).
export const updateQuantity = mutation({
  args: { id: v.id("carts"), quantity: v.number() },
  handler: async (ctx, { id, quantity }) => {
    const caller = await requireUser(ctx);
    const row = await ctx.db.get(id);
    if (!row || row.userId !== caller._id) throw new Error("Unauthorized");
    if (quantity < 1) {
      await ctx.db.delete(id);
      return;
    }
    await ctx.db.patch(id, { quantity });
  },
});

// Remove a single cart line by its row id.
export const remove = mutation({
  args: { id: v.id("carts") },
  handler: async (ctx, { id }) => {
    const caller = await requireUser(ctx);
    const row = await ctx.db.get(id);
    if (!row || row.userId !== caller._id) throw new Error("Unauthorized");
    await ctx.db.delete(id);
  },
});

// Empty a user's cart (the drawer's "Clear Cart" action).
export const clearByUser = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const caller = await requireUser(ctx);
    if (caller._id !== userId) throw new Error("Unauthorized");
    const rows = await ctx.db
      .query("carts")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    await Promise.all(rows.map((r) => ctx.db.delete(r._id)));
  },
});
