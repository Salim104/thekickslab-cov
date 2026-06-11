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

// Wishlist rows for a user, each joined to its product. Skips rows whose product
// was since deleted. Used by the account Wishlist tab; the `wishlistId` is the
// row id so the UI can remove a single saved item.
export const getByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const rows = await ctx.db
      .query("wishlists")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    const items = await Promise.all(
      rows.map(async (row) => {
        const product = await ctx.db.get(row.productId);
        return product ? { wishlistId: row._id, product } : null;
      })
    );
    return items.filter((i) => i !== null);
  },
});

// Add a product to a user's wishlist. No-op if already saved (deduped by
// user + product), so the guest→Convex merge on login can't create duplicates.
export const addItem = mutation({
  args: { userId: v.id("users"), productId: v.id("products") },
  handler: async (ctx, { userId, productId }) => {
    const caller = await requireUser(ctx);
    if (caller._id !== userId) throw new Error("Unauthorized");
    const existing = await ctx.db
      .query("wishlists")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    if (existing.some((r) => r.productId === productId)) return;
    await ctx.db.insert("wishlists", { userId, productId });
  },
});

// Remove a single saved item by its wishlist row id.
export const remove = mutation({
  args: { id: v.id("wishlists") },
  handler: async (ctx, { id }) => {
    const caller = await requireUser(ctx);
    const row = await ctx.db.get(id);
    if (!row || row.userId !== caller._id) throw new Error("Unauthorized");
    await ctx.db.delete(id);
  },
});

// Remove a saved item by product (used by the wishlist drawer / toggle, which
// know the product but not the wishlist row id). No-op if not saved.
export const removeByProduct = mutation({
  args: { userId: v.id("users"), productId: v.id("products") },
  handler: async (ctx, { userId, productId }) => {
    const caller = await requireUser(ctx);
    if (caller._id !== userId) throw new Error("Unauthorized");
    const rows = await ctx.db
      .query("wishlists")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    const match = rows.find((r) => r.productId === productId);
    if (match) await ctx.db.delete(match._id);
  },
});
