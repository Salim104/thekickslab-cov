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
});
