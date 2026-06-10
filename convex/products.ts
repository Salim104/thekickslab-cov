import { query } from "./_generated/server";

// All products, newest first. Homepage Shop All uses the first 8.
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("products").order("desc").collect();
  },
});

// Up to 3 products flagged as best sellers, for the homepage Best Selling row.
export const getBestSellers = query({
  args: {},
  handler: async (ctx) => {
    const bestSellers = await ctx.db
      .query("products")
      .withIndex("by_bestSeller", (q) => q.eq("isBestSeller", true))
      .collect();
    return bestSellers.slice(0, 3);
  },
});
