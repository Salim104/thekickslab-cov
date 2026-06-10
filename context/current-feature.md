# Current Feature: Product Detail Page

## Feature File
`context/features/04-product-detail.md`

## Goals
- `/product/[slug]` dynamic route — server page fetches product by slug, `notFound()` if missing
- Breadcrumb: Home → / | All → /shop | product name (plain text)
- Left: main image (object-contain) with prev/next arrow buttons + row of 4 thumbnails (w-20 h-20, active border-black, click to swap main); 1-image products repeat the same image 4×
- Right: name h1 (text-2xl font-bold), sale price bold + original line-through (text-gray-500) + red "-X%" badge
- Right: quantity selector (decrement / input / increment, min 1)
- Right: ADD TO CART (full-width black) adds product + quantity to Zustand cart store
- Right: Add to Wishlist (border button, red heart) toggling label on isInWishlist; Continue Shopping → /shop; "Categories: {category}"
- Tabs: Description (default, generated paragraph from name + brand) / Reviews ("There are no reviews yet.")
- Related products: same brand OR category, exclude current slug, max 3 — reuse `ProductCard` (3-col lg / 2-col sm / 1-col mobile)
- Responsive: stacked at 375px, side-by-side at 1280px; loading state handled; `npm run build` passes

## Notes
- Convex: add `getBySlug(slug)` → single product | null, and `getRelated(brand, category, excludeSlug)` → max 3
- Seed: all 12 products need a kebab-case `slug` field; `images` repeats single Cloudinary URL 4× until real multi-image exists
- Split: server `app/product/[slug]/page.tsx` (data fetch) + `"use client"` `components/ProductDetailClient.tsx` (mainImage, quantity, tabs, cart, wishlist state)
- No size selector in this version (matches old project); Clerk auth not required
- Cloudinary: spec calls for CldImage — but Cloudinary is still unconfigured (prior features used next/image); confirm at `start`
- Icons: react-icons not installed — use lucide-react (heart, arrows) or inline SVG
- Price format R1799.99 via toFixed(2) (existing `formatZAR` helper)

## Status
`In Progress`

## History
- `Navbar + Cart Drawer + Wishlist Drawer + Footer` — built Zustand stores `cartStore.ts` (items, totalItems/totalAmount derived, addItem merges by id+size, removeItem, updateQuantity, clearCart, localStorage persist with totals recomputed on rehydrate) and `wishlistStore.ts` (items, totalItems, addItem/removeItem/toggleItem/isInWishlist, persist); added ephemeral `uiStore.ts` so navbar icons open the sibling drawers without prop-drilling; added `formatZAR` helper to `lib/utils.ts` (R1799.99, no space). Installed shadcn `sheet`. Built `Navbar.tsx` (sticky white bar, next/image logo, Home/Shop/Contact links, lucide search/wishlist/cart/profile icons with red count badges, mobile hamburger dropdown, mounted-guard for hydration), `CartDrawer.tsx` + `WishlistDrawer.tsx` (shadcn Sheet right slide-in `sm:max-w-md`, item rows, subtotal + Clear/Checkout, Add to Cart/Remove, empty states → /shop), `Footer.tsx` (black 4-column grid, collapses on mobile, copyright bar); mounted all four in `layout.tsx`. Clerk UserButton deferred (no Clerk keys in env) — used profile-icon placeholder. `npm run build` passes. Committed together with the project scaffold as the first real commit (no remote configured — not pushed). Status: `Complete`
- `Homepage` — discovered Phase 1's Convex layer was never built, so built it as foundation: `convex/schema.ts` (products/users/wishlists/carts tables, `by_slug` + `by_bestSeller` indexes), `convex/products.ts` (`getAll` ordered desc, `getBestSellers` filtered via index, max 3), and idempotent `convex/seed.ts` (`seedProducts` mutation — 12 products carried from old `products.json`, slugified, local `/assets/...` image paths, default sizes 6–12, 3 flagged `isBestSeller`); pushed via the already-running `convex dev` watcher and seeded with `npx convex run seed:seedProducts` against `knowing-dotterel-831`. Frontend: `ConvexClientProvider.tsx` wrapping the layout body so client sections can `useQuery`; shadcn `skeleton.tsx`; single shared `ProductCard.tsx` (next/image `fill object-contain h-60` group-hover scale, red `-{discount}%` badge, whole-card `next/link` → `/product/[slug]`, uppercase name, red-600 bold sale price + gray-400 line-through original, `formatZAR`); five sections in `src/sections/` — `HeroSlider` (3 local slides, opacity fade, 5s auto-advance, white/20 lucide arrows, dot indicators, headline + black Shop Now→/shop), `FeaturesStrip` (lucide Truck/Trophy/Headphones), `BestSelling` + `ShopAll` (Convex `useQuery`, Skeleton loading + empty-state CTAs, ShopAll slices first 8), static `Deals` (black banner, "30% OFF", deals image); `app/page.tsx` composes all five. Decisions: **next/image not CldImage** (Cloudinary unconfigured — deferred); built full schema (not just products) as canonical foundation; `getAll` is newest-first. `npm run build` passes; runtime smoke-tested (home 200, all headings present, image optimizer handles spaced/parenthesized filenames). Merged `feature/homepage` into `master` via `--no-ff` (no `dev`/`main` branch and no git remote exist yet — not pushed). Status: `Complete`
