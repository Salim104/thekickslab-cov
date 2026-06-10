# Current Feature: Homepage

## Feature File
`context/features/03-homepage.md`

## Goals
- Build `app/page.tsx` homepage composing five sections in order: Hero → Features → Best Selling → Deals → Shop All
- **HeroSlider** — full-width bg-image slider (`h-[500px] md:h-[600px]`), 3 slides from `public/assets/slide-{1,2,3}.png`, opacity fade transition, 5s auto-advance, prev/next arrows (white/20 bg), white dot indicators bottom-center; headline "BE ON THE GO WITH THE BEST KICKS" (uppercase bold white) + black "Shop Now" button → `/shop`
- **FeaturesStrip** — white bg, 3 items with SVG icon + bold title + subtitle: Free Shipping (truck), Affordable Prices (trophy), Dedicated Support (headset)
- **BestSelling** — white bg, "BEST SELLING" h2, 3-col grid (1 mobile), queries `api.products.getBestSellers` (max 3, `isBestSeller: true`)
- **Deals** — static black banner, left "30% OFF" (OFF in red-600) + "Hot & Exclusive deals" + white "Shop Now", right deals image from `public/assets/deals-image.png`
- **ShopAll** — white bg, "Shop All" h2, 4-col (lg) / 2 (tablet) / 1 (mobile), queries `api.products.getAll` first 8
- **ProductCard** — single shared component: red `-{discount}%` badge top-left, CldImage `object-contain h-60 hover:scale-105` wrapped in `next/link` → `/product/[slug]`, name uppercase `text-sm text-gray-700`, sale price red-600 bold + original gray-400 line-through. No wishlist/cart button (matches old design)
- Convex queries `api.products.getBestSellers` and `api.products.getAll` (create if missing)
- Loading states with Shadcn Skeleton; empty states with message + CTA
- Responsive at 375px and 1280px; `npm run build` passes

## Notes
- UI reference: old project `src/sections/` and `src/components/ProductCard.jsx`
- ProductCard uses **CldImage** for product images (Cloudinary URLs from Convex); Hero + Deals use **next/image** (local `public/assets/` files)
- Copy `slide-1.png`, `slide-2.png`, `slide-3.png`, `deals-image.png` from old project → `public/assets/`
- Convex must have products seeded before sections render real data
- `slug` field on product drives `/product/[slug]` links
- Auth: not required. Resend: no email trigger.
- **Pre-work discovered:** Phase 1 Convex layer was never built — no `convex/schema.ts`, no products queries, no seed, no ConvexProvider. Building these as part of this feature.
- **Decision (user):** Images stay local in `public/assets/` rendered with **next/image** (Cloudinary deferred); seed stores `/assets/...` paths. ProductCard uses next/image, not CldImage, for now.
- **Decision (user):** Claude runs `npx convex dev --once` to push schema/functions + seed against `knowing-dotterel-831`.
- Best sellers = AIR JORDAN 4 RETRO BLACK CAT, JORDAN 4 RETRO SB PINE GREEN, Air Max Tailwind V x Skepta Chrome Blue (from old BestSelling.jsx).

## Status
`In Progress`

## History
- `Navbar + Cart Drawer + Wishlist Drawer + Footer` — built Zustand stores `cartStore.ts` (items, totalItems/totalAmount derived, addItem merges by id+size, removeItem, updateQuantity, clearCart, localStorage persist with totals recomputed on rehydrate) and `wishlistStore.ts` (items, totalItems, addItem/removeItem/toggleItem/isInWishlist, persist); added ephemeral `uiStore.ts` so navbar icons open the sibling drawers without prop-drilling; added `formatZAR` helper to `lib/utils.ts` (R1799.99, no space). Installed shadcn `sheet`. Built `Navbar.tsx` (sticky white bar, next/image logo, Home/Shop/Contact links, lucide search/wishlist/cart/profile icons with red count badges, mobile hamburger dropdown, mounted-guard for hydration), `CartDrawer.tsx` + `WishlistDrawer.tsx` (shadcn Sheet right slide-in `sm:max-w-md`, item rows, subtotal + Clear/Checkout, Add to Cart/Remove, empty states → /shop), `Footer.tsx` (black 4-column grid, collapses on mobile, copyright bar); mounted all four in `layout.tsx`. Clerk UserButton deferred (no Clerk keys in env) — used profile-icon placeholder. `npm run build` passes. Committed together with the project scaffold as the first real commit (no remote configured — not pushed). Status: `Complete`
