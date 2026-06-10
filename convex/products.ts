import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Shared field validators for create/update so the two stay in sync.
const productFields = {
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
};

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

// --- Admin mutations -------------------------------------------------------
// NOTE: these are not yet auth-gated. The /admin auth gate is a deliberate TODO
// (no Clerk keys in env). Add a role check here once Clerk + the user webhook
// are wired so these can't be called by non-admins.

// Create a new product. Returns the new id.
export const create = mutation({
  args: productFields,
  handler: async (ctx, args) => {
    return await ctx.db.insert("products", args);
  },
});

// Update an existing product by id.
export const update = mutation({
  args: { id: v.id("products"), ...productFields },
  handler: async (ctx, { id, ...fields }) => {
    await ctx.db.patch(id, fields);
    return id;
  },
});

// Delete a product by id.
export const remove = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});
