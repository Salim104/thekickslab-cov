# Feature: Product Detail Page

## Description
Individual product page at /product/[slug] showing image gallery,
product info, quantity selector, add to cart, add to wishlist,
description/reviews tabs, and related products section.

## Design Reference
- UI reference: old project src/pages/ProductDetail.jsx
- Key design decisions:
  - Left half: main image + prev/next arrows on image + 4 thumbnails row below (border-2 black when active)
  - Right half: product name h1, price (sale bold + original line-through + red discount badge), quantity +/- selector, ADD TO CART (full width black button), Add to Wishlist (border button with red heart icon), Continue Shopping (border button → /shop)
  - Below product: Description / Reviews tabs (border-b-2 border-black on active)
  - Description tab: 2 paragraphs of generated text using product name + brand
  - Reviews tab: "There are no reviews yet."
  - Related products: h2 "Related products", 3-col grid using inline card (same as ProductCard)
  - Breadcrumb: Home / All / {product.name}

## Requirements
- [ ] /product/[slug] dynamic route
- [ ] Breadcrumb: Home → /  |  All → /shop  |  product name (plain text)
- [ ] Left: main product image (object-contain, full width), prev/next arrow buttons on image
- [ ] Left: 4 thumbnails below (w-20 h-20 object-contain), click to set main image, active border-black
- [ ] If product has 1 image in Convex, show same image 4x in thumbnails
- [ ] Right: product name h1 text-2xl font-bold
- [ ] Right: sale price bold, original price line-through text-gray-500, red discount badge "-X%"
- [ ] Right: quantity selector — decrement / number input / increment, min 1
- [ ] Right: ADD TO CART — full width black button, adds product + quantity to Zustand cart store
- [ ] Right: Add to Wishlist — border button, red FaHeart icon, toggles text based on isInWishlist
- [ ] Right: Continue Shopping → /shop
- [ ] Right: "Categories: {category}" text-sm text-gray-600
- [ ] Tabs: Description (active by default) and Reviews (0)
- [ ] Description tab: generated paragraph using product.name and product.brand
- [ ] Reviews tab: "There are no reviews yet."
- [ ] Related products: query same brand OR same category, exclude current slug, max 3
- [ ] Related products: 3-col grid lg, 2-col sm, 1-col mobile — reuse ProductCard component
- [ ] If product slug not found → notFound() from next/navigation

## Technical Notes

### Convex
- Query: api.products.getBySlug — accepts slug: string, returns single product or null
- Query: api.products.getRelated — accepts brand: string, category: string, excludeSlug: string, returns max 3

### Clerk
- Auth required: No

### Cloudinary
- Images needed: Yes — CldImage for main image and thumbnails

### Resend
- Email trigger: No

### Components needed
- app/product/[slug]/page.tsx — server component, fetches product by slug
- components/ProductDetailClient.tsx — "use client", handles all state (mainImage, quantity, tabs, cart, wishlist)

## Convex Seed Notes
All 12 products need a slug field added. Use kebab-case of name:
- "adidas Campus Core Black and White" → "adidas-campus-core-black-and-white"
- "AIR JORDAN 4 RETRO BLACK CAT" → "air-jordan-4-retro-black-cat"
- etc.
Images field: string[] — use Cloudinary URL for each product's single image (same URL 4x until real multi-image exists)

## Acceptance Criteria
- [ ] Works on mobile (375px) — stacked layout, image top, details below
- [ ] Works on desktop (1280px) — side by side
- [ ] Thumbnails click to change main image
- [ ] Prev/next arrows cycle through images
- [ ] Quantity selector works, min 1
- [ ] ADD TO CART adds correct product + quantity to cart, cart badge updates
- [ ] Add to Wishlist toggles correctly
- [ ] Tabs switch between Description and Reviews
- [ ] Related products load from Convex
- [ ] 404 handled via notFound()
- [ ] Loading state handled
- [ ] npm run build passes

## Status
Not Started

## Notes
- Split into server page.tsx (data fetch) + client ProductDetailClient.tsx (interactivity)
- No size selector in this version — matches old project exactly
- Price formatted as R1799.99 (toFixed(2), no comma separator needed for these prices)
- react-icons not installed — use inline SVG or lucide-react for heart and arrow icons

## History