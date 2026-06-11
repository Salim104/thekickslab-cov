import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  products: defineTable({
    name: v.string(),
    brand: v.string(),
    slug: v.string(),
    price: v.number(),
    originalPrice: v.number(),
    discountPercent: v.number(),
    images: v.array(v.string()),
    category: v.string(),
    sizes: v.array(v.string()),
    inStock: v.boolean(),
    isBestSeller: v.boolean(),
    isOnDeal: v.boolean(),
  })
    .index("by_slug", ["slug"])
    .index("by_bestSeller", ["isBestSeller"]),

  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.string(),
    role: v.union(v.literal("customer"), v.literal("admin")),
  }).index("by_clerkId", ["clerkId"]),

  wishlists: defineTable({
    userId: v.id("users"),
    productId: v.id("products"),
  }).index("by_user", ["userId"]),

  carts: defineTable({
    userId: v.id("users"),
    productId: v.id("products"),
    size: v.string(),
    quantity: v.number(),
  }).index("by_user", ["userId"]),

  orders: defineTable({
    // Null for guest checkout; set when the buyer is signed in.
    userId: v.optional(v.id("users")),
    orderNumber: v.string(), // TKL-YYYYMMDD-XXXX
    items: v.array(
      v.object({
        productId: v.id("products"),
        name: v.string(),
        image: v.string(),
        size: v.string(),
        quantity: v.number(),
        price: v.number(),
      })
    ),
    shipping: v.object({
      firstName: v.string(),
      lastName: v.string(),
      email: v.string(),
      phone: v.string(),
      address1: v.string(),
      address2: v.optional(v.string()),
      city: v.string(),
      province: v.string(),
      postalCode: v.string(),
    }),
    subtotal: v.number(),
    total: v.number(),
    status: v.union(
      v.literal("pending"),
      v.literal("paid"),
      v.literal("shipped"),
      v.literal("delivered"),
      v.literal("cancelled")
    ),
    stripePaymentIntentId: v.string(),
    createdAt: v.number(),
  })
    .index("by_orderNumber", ["orderNumber"])
    .index("by_user", ["userId"])
    .index("by_paymentIntent", ["stripePaymentIntentId"]),
});
