# Feature: Shop Page

## Description
Full product catalogue at /shop with sidebar filters and product grid.
All products from Convex. Filters are functional.

## Design Reference
- UI reference: old project src/pages/Shop.jsx
- Key design decisions:
  - Top: "Showing 1 - 12 of X results" text-sm text-gray-500
  - Layout: sidebar left (w-1/4) + product grid right (w-3/4)
  - Sidebar: search input (rounded-full), price range slider, product categories list, product tags
  - Grid: 3 columns lg, 2 columns sm, 1 column mobile — reuses ProductCard
  - Sort dropdown top-right of grid: Default, Popularity, Price Low-High, Price High-Low
  - Pagination: numbered circles, active = black bg white text, NEXT button

## Requirements
- [ ] /shop route
- [ ] "Showing X - Y of Z results" label top of page
- [ ] Sidebar — search input: filters grid by name in real time
- [ ] Sidebar — price range slider: min R0, max R2000, shows "Price: R1000 — R{value}"
- [ ] Sidebar — Filter button (black) applies price range filter
- [ ] Sidebar — Product categories: list of brands with count, click filters grid by brand
- [ ] Sidebar — Product tags: static tag "NEW BALANCE 550" for now
- [ ] Grid — sort dropdown: Default / Price Low-High / Price High-Low
- [ ] Grid — 3 columns lg, 2 columns sm, 1 column mobile
- [ ] Grid — reuses ProductCard component
- [ ] Pagination — 12 products per page, numbered buttons + NEXT, active page black circle
- [ ] Mobile — sidebar collapses, "Filter" button opens it as a drawer (Shadcn Sheet)

## Technical Notes

### Convex
- Query: api.products.getFiltered
  - Args: search?: string, brand?: string, maxPrice?: number, sort?: "default" | "price_asc" | "price_desc"
  - Returns: all matching products
- Query: api.products.getBrands — returns distinct brand names with counts

### Clerk
- Auth required: No

### Cloudinary
- Images needed: Yes — via ProductCard → CldImage

### Resend
- Email trigger: No

### Components needed
- app/shop/page.tsx — server component shell
- components/ShopClient.tsx — "use client", all filter/sort/pagination state
- components/FilterSidebar.tsx — search, price slider, categories, tags
- components/SortDropdown.tsx — sort select element

## Acceptance Criteria
- [ ] Works on mobile (375px) — sidebar behind Filter button/drawer
- [ ] Works on desktop (1280px) — sidebar visible left
- [ ] Search filters products by name in real time
- [ ] Price slider filters products correctly on Filter button click
- [ ] Brand category click filters grid
- [ ] Sort dropdown reorders grid correctly
- [ ] Pagination shows correct page of products
- [ ] "Showing X - Y of Z results" updates with filters
- [ ] ProductCard links to /product/[slug]
- [ ] Loading states handled with Shadcn Skeleton
- [ ] Empty state: "No products found" when filters return nothing
- [ ] npm run build passes

## Status
Not Started

## Notes
- Filtering done client-side (all 12 products fit in memory — no need for server pagination yet)
- Categories list derived from products: adidas (2), Jordan (2), Nike (2), New Balance (6)
- Product tags section is static for now — just "NEW BALANCE 550" tag
- Price range slider min fixed at R1000 (matches old design: "Price: R1000 — R{value}")
- Mobile filter drawer uses Shadcn Sheet from bottom or left

## History