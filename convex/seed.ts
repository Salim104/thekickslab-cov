import { mutation } from "./_generated/server";

const DEFAULT_SIZES = ["6", "7", "8", "9", "10", "11", "12"];

// Best sellers carried over from the old storefront's BestSelling section.
const BEST_SELLERS = new Set([
  "AIR JORDAN 4 RETRO BLACK CAT",
  "JORDAN 4 RETRO SB PINE GREEN",
  "Air Max Tailwind V x Skepta Chrome Blue",
]);

type SeedProduct = {
  name: string;
  brand: string;
  image: string;
  originalPrice: number;
  price: number;
  discountPercent: number;
};

const PRODUCTS: SeedProduct[] = [
  { name: "adidas Campus Core Black and White", brand: "adidas", image: "/assets/adidas Campus 00s-1.png", originalPrice: 1799.99, price: 1529.99, discountPercent: 15 },
  { name: "ADIDAS YEEZY 700 V3 MONO SAFFLOWER", brand: "adidas", image: "/assets/adidas-adidas-yeezy-700-1.png", originalPrice: 1999.99, price: 1599.99, discountPercent: 30 },
  { name: "AIR JORDAN 4 RETRO BLACK CAT", brand: "Jordan", image: "/assets/jordan-air-jordan-4-retro-black-cat-2020-sneakers-1.png", originalPrice: 1899.99, price: 1799.99, discountPercent: 10 },
  { name: "Air Max Tailwind V x Skepta Chrome Red", brand: "Nike", image: "/assets/Air Max Tailwind V x Skepta(Chrome red)-1.png", originalPrice: 1899.99, price: 1699.99, discountPercent: 10 },
  { name: "Air Max Tailwind V x Skepta Chrome Blue", brand: "Nike", image: "/assets/Air Max Tailwind V x Skepta(Chrome Blue)-1.png", originalPrice: 1999.99, price: 1699.99, discountPercent: 15 },
  { name: "JORDAN 4 RETRO SB PINE GREEN", brand: "Jordan", image: "/assets/nike-nike-sb-dunk-low-jarritos-sneakers-1.png", originalPrice: 1999.99, price: 1799.99, discountPercent: 10 },
  { name: "New Balance 327 Black & White", brand: "New Balance", image: "/assets/new balance 327 black-1.png", originalPrice: 1699.99, price: 1499.99, discountPercent: 10 },
  { name: "NEW BALANCE 550 AiME LEON DORE WHITE GREY", brand: "New Balance", image: "/assets/new-balance-new-balance-550-aime-leon-dore-white-grey-sneakers-1.png", originalPrice: 1899.99, price: 1599.99, discountPercent: 15 },
  { name: "NEW BALANCE 550 GS WHITE VINTAGE TEAL", brand: "New Balance", image: "/assets/new-balance-new-balance-550-gs-white-vintage-teal-streetwear-1.png", originalPrice: 1899.99, price: 1699.99, discountPercent: 10 },
  { name: "NEW BALANCE 550 WHITE GREY", brand: "New Balance", image: "/assets/new-balance-new-balance-550-white-grey-sneakers-1.png", originalPrice: 1999.99, price: 1899.99, discountPercent: 5 },
  { name: "NEW BALANCE 550 WHITE RED", brand: "New Balance", image: "/assets/new-balance-new-balance-550-white-red-sneakers-1.png", originalPrice: 1999.99, price: 1899.99, discountPercent: 5 },
  { name: "NEW BALANCE 990 GREY", brand: "New Balance", image: "/assets/nike-nike-dunk-low-grey-fog-sneakers.png", originalPrice: 1899.99, price: 1699.99, discountPercent: 10 },
];

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Idempotent: skips if products already exist so it can be re-run safely.
export const seedProducts = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("products").take(1);
    if (existing.length > 0) {
      return { seeded: 0, message: "Products already seeded — skipping." };
    }

    for (const p of PRODUCTS) {
      await ctx.db.insert("products", {
        name: p.name,
        brand: p.brand,
        slug: slugify(p.name),
        price: p.price,
        originalPrice: p.originalPrice,
        discountPercent: p.discountPercent,
        images: [p.image],
        category: "sneakers",
        sizes: DEFAULT_SIZES,
        inStock: true,
        isBestSeller: BEST_SELLERS.has(p.name),
        isOnDeal: p.discountPercent >= 15,
      });
    }

    return { seeded: PRODUCTS.length, message: "Seeded products." };
  },
});
