import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";

// TKL-YYYYMMDD-XXXX. Generated server-side so the number can't be spoofed by the
// client. The random suffix makes collisions on the same day vanishingly likely.
function generateOrderNumber(): string {
  const now = new Date();
  const ymd =
    now.getUTCFullYear().toString() +
    String(now.getUTCMonth() + 1).padStart(2, "0") +
    String(now.getUTCDate()).padStart(2, "0");
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `TKL-${ymd}-${suffix}`;
}

const cartItemArg = v.object({
  productId: v.id("products"),
  size: v.string(),
  quantity: v.number(),
});

const shippingArg = v.object({
  firstName: v.string(),
  lastName: v.string(),
  email: v.string(),
  phone: v.string(),
  address1: v.string(),
  address2: v.optional(v.string()),
  city: v.string(),
  province: v.string(),
  postalCode: v.string(),
});

// Creates a `pending` order. Prices are looked up from the products table here —
// NEVER trusted from the client — so a tampered cart can't change what's charged.
// The Stripe PaymentIntent is created from the `total` this returns; the webhook
// later flips the order to `paid` via markPaid. Returns the order number + total.
export const create = mutation({
  args: {
    userId: v.optional(v.id("users")),
    items: v.array(cartItemArg),
    shipping: shippingArg,
  },
  handler: async (ctx, { userId, items, shipping }) => {
    if (items.length === 0) {
      throw new Error("Cannot create an order with an empty cart.");
    }

    // Enrich each line from the authoritative product record. Lines whose product
    // no longer exists are dropped.
    const enriched = [];
    for (const line of items) {
      const product = await ctx.db.get(line.productId);
      if (!product) continue;
      const quantity = Math.max(1, Math.floor(line.quantity));
      enriched.push({
        productId: line.productId,
        name: product.name,
        image: product.images?.[0] ?? "",
        size: line.size,
        quantity,
        price: product.price,
      });
    }

    if (enriched.length === 0) {
      throw new Error("None of the cart items are available.");
    }

    const subtotal = enriched.reduce((s, i) => s + i.price * i.quantity, 0);
    const total = subtotal; // No shipping fee yet (Phase 3 note).

    const orderNumber = generateOrderNumber();
    const orderId = await ctx.db.insert("orders", {
      userId,
      orderNumber,
      items: enriched,
      shipping,
      subtotal,
      total,
      status: "pending",
      stripePaymentIntentId: "",
      createdAt: Date.now(),
    });

    return { orderId, orderNumber, total };
  },
});

// Marks an order paid (idempotently). Called from the Stripe webhook on
// payment_intent.succeeded. `justPaid` is true only on the pending→paid
// transition, so the webhook sends confirmation emails exactly once even if
// Stripe retries the event.
export const markPaid = mutation({
  args: { orderNumber: v.string(), stripePaymentIntentId: v.string() },
  handler: async (ctx, { orderNumber, stripePaymentIntentId }) => {
    const order = await ctx.db
      .query("orders")
      .withIndex("by_orderNumber", (q) => q.eq("orderNumber", orderNumber))
      .unique();
    if (!order) return { order: null, justPaid: false };

    const justPaid = order.status === "pending";
    if (justPaid) {
      await ctx.db.patch(order._id, { status: "paid", stripePaymentIntentId });
    }
    return { order: { ...order, status: justPaid ? "paid" : order.status }, justPaid };
  },
});

// Single order by its number, for the success page. Returns null if not found.
export const getByOrderNumber = query({
  args: { orderNumber: v.string() },
  handler: async (ctx, { orderNumber }) => {
    return await ctx.db
      .query("orders")
      .withIndex("by_orderNumber", (q) => q.eq("orderNumber", orderNumber))
      .unique();
  },
});

// A signed-in user's orders, newest first, for the account Orders tab.
export const getByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const orders = await ctx.db
      .query("orders")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    return orders.sort((a, b) => b.createdAt - a.createdAt);
  },
});

// All orders, newest first, for the admin Orders table.
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const orders = await ctx.db.query("orders").collect();
    return orders.sort((a, b) => b.createdAt - a.createdAt);
  },
});

// Admin status change from the orders table dropdown.
// NOTE: not yet auth-gated at the data layer (consistent with the other admin
// mutations) — the /admin route is gated by Clerk; add a role check here when the
// data-layer auth follow-up lands.
export const updateStatus = mutation({
  args: {
    id: v.id("orders"),
    status: v.union(
      v.literal("pending"),
      v.literal("paid"),
      v.literal("shipped"),
      v.literal("delivered"),
      v.literal("cancelled")
    ),
  },
  handler: async (ctx, { id, status }) => {
    await ctx.db.patch(id as Id<"orders">, { status });
  },
});
