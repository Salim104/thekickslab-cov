import { query } from "./_generated/server";
import { v } from "convex/values";

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

// Single product by slug, or null if not found. Used by the product detail page.
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    return await ctx.db
      .query("products")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
  },
});

// Distinct brand names with how many products each has, for the shop sidebar
// "Product categories" list. Sorted by count desc, then name. Cheap at 12 rows.
export const getBrands = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("products").collect();
    const counts = new Map<string, number>();
    for (const p of all) {
      counts.set(p.brand, (counts.get(p.brand) ?? 0) + 1);
    }
    return Array.from(counts, ([brand, count]) => ({ brand, count })).sort(
      (a, b) => b.count - a.count || a.brand.localeCompare(b.brand)
    );
  },
});

// Up to 3 products sharing the brand OR category, excluding the current product.
export const getRelated = query({
  args: { brand: v.string(), category: v.string(), excludeSlug: v.string() },
  handler: async (ctx, { brand, category, excludeSlug }) => {
    const all = await ctx.db.query("products").collect();
    return all
      .filter(
        (p) =>
          p.slug !== excludeSlug &&
          (p.brand === brand || p.category === category)
      )
      .slice(0, 3);
  },
});
