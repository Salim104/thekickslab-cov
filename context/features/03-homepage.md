# Feature: Homepage

## Description
Full homepage with Hero slider, Features strip, Best Selling section,
Deals banner, and Shop All section. All product data from Convex.

## Design Reference
- UI reference: old project src/sections/ and src/components/ProductCard.jsx
- Key design decisions:
  - Hero: full-width bg-image slider, h-[500px] md:h-[600px], white bold headline left, black "Shop Now" button, prev/next arrow buttons (white/20 bg), white dot indicators bottom-center, 5s auto-advance
  - Features strip: white bg, 3 items with SVG icon + bold title + subtitle, full width
  - Best Selling: white bg, "BEST SELLING" h2 bold, 3-column grid, ProductCard
  - Deals: black bg, left side "30% OFF" (OFF in red-600) + "Hot & Exclusive deals" + white "Shop Now" button, right side deals image
  - Shop All: white bg, "Shop All" h2 bold, 4-column grid (lg), 8 products, ProductCard

## Requirements
- [ ] Hero slider — 3 slides from public/assets/slide-1.png, slide-2.png, slide-3.png
- [ ] Hero — opacity fade transition between slides, 5s auto-advance
- [ ] Hero — prev/next arrow buttons, dot indicators
- [ ] Hero — headline "BE ON THE GO WITH THE BEST KICKS" uppercase bold white, "Shop Now" → /shop
- [ ] Features strip — 3 items: Free Shipping (truck icon), Affordable Prices (trophy icon), Dedicated Support (headset icon)
- [ ] Best Selling — query api.products.getBestSellers, 3 columns desktop, 1 mobile
- [ ] Deals banner — static section, black bg, "30% OFF" + deals image from public/assets/deals-image.png
- [ ] Shop All — query api.products.getAll, first 8, 4 columns desktop, 2 tablet, 1 mobile
- [ ] ProductCard — shared component used in all sections:
  - Red discount badge top-left: "-{discount}%"
  - Product image, object-contain, h-60, hover scale-105
  - Link wraps image → /product/[slug]
  - Name uppercase text-sm text-gray-700
  - Sale price red-600 bold, original price gray-400 line-through
  - No wishlist/cart button on card (matches old design exactly)

## Technical Notes

### Convex
- Query: api.products.getBestSellers → filter isBestSeller: true, returns max 3
- Query: api.products.getAll → returns all products, page uses first 8

### Clerk
- Auth required: No

### Cloudinary
- Images needed: Yes — CldImage for product images in ProductCard
- Hero slides and deals image use next/image from public/assets/

### Resend
- Email trigger: No

### Components needed
- app/page.tsx — homepage, imports all sections
- sections/HeroSlider.tsx — full slider with auto-advance, arrows, dots
- sections/FeaturesStrip.tsx — 3-item strip with icons
- sections/BestSelling.tsx — fetches api.products.getBestSellers
- sections/Deals.tsx — static black banner
- sections/ShopAll.tsx — fetches api.products.getAll
- components/ProductCard.tsx — single shared card component

## Acceptance Criteria
- [ ] Works on mobile (375px)
- [ ] Works on desktop (1280px)
- [ ] Hero slider auto-advances every 5s, arrows and dots work
- [ ] Best Selling shows 3 products from Convex
- [ ] Shop All shows 8 products from Convex
- [ ] ProductCard discount badge shows correct %
- [ ] ProductCard image links to /product/[slug]
- [ ] Deals image loads from public/assets/deals-image.png
- [ ] Loading states handled with Shadcn Skeleton
- [ ] Empty states handled
- [ ] npm run build passes

## Status
Not Started

## Notes
- ProductCard uses CldImage for product images (Cloudinary URLs from Convex)
- Hero and Deals use next/image (local public/assets files)
- Convex must have products seeded before this feature works
- Slug field on product used for /product/[slug] links
- Copy slide-1.png, slide-2.png, slide-3.png, deals-image.png from old project → public/assets/

## History