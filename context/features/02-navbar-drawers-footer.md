# Feature: Navbar + Cart Drawer + Wishlist Drawer + Footer

## Description
Global navigation bar with logo, nav links, icon buttons (search, wishlist, cart),
and Clerk UserButton. Cart and Wishlist open as right-side slide-in panels.
Black footer with 4-column layout. All render in app/layout.tsx.

## Design Reference
- UI reference: old project src/components/Navbar.jsx, CartDrawer.jsx, WishlistDrawer.jsx, Footer.jsx
- Key design decisions:
  - Navbar: white background, logo left, nav links center, icons right
  - Icons: search (decorative), heart (wishlist) with red badge, cart bag SVG with red badge, Clerk UserButton
  - Cart drawer: right slide-in, max-w-md, item list with image + name + qty × price, subtotal, Clear Cart + Checkout buttons
  - Wishlist drawer: same layout, each item has Add to Cart + Remove buttons
  - Empty states: "Your cart is empty" / "Your wishlist is empty" + Continue Shopping link → /shop
  - Footer: black background, 4 columns (Brand + logo, COMPANY, HELP, SUPPORT), copyright bar

## Requirements
- [ ] Navbar fixed top, white bg, py-2 px-6, flex justify-between
- [ ] Logo: public/assets/main-logo.png via next/image, h-8
- [ ] Nav links: Home, Shop, Contact via next/link, text-sm font-medium hover:text-red-600
- [ ] Search button: decorative only (no functionality)
- [ ] Wishlist icon: public/assets/icons-images/favorite.svg, red badge when wishlistItems > 0
- [ ] Cart icon: bag SVG inline, red badge when totalItems > 0
- [ ] Clerk UserButton rendered right of cart icon
- [ ] Cart drawer: Shadcn Sheet from right, max-w-md
  - Header: "Your Cart (n)", close button
  - Item row: image (object-contain) + name + qty × R price + delete icon
  - Footer: Subtotal, Clear Cart button, Checkout button (→ /checkout, disabled for now)
- [ ] Wishlist drawer: Shadcn Sheet from right, max-w-md
  - Header: "Your Wishlist (n)", close button
  - Item row: image + name (link → /product/[slug]) + R price + Add to Cart button + Remove button
- [ ] Cart state: Zustand store, localStorage persist, totalItems + totalAmount
- [ ] Wishlist state: Zustand store, localStorage persist, totalItems
- [ ] Footer: black bg, text-white, 4-column grid
  - Col 1: logo + brand description
  - Col 2: COMPANY links (About Us, Careers, Store Locations, Our Blog, Reviews)
  - Col 3: HELP links (Customer Service, My Account, Find a Store, Legal & Privacy, Contact, Gift Cards)
  - Col 4: SUPPORT links (Shipping Policy, Returns & Exchanges, Authenticity Guarantee, FAQ)
  - Bottom bar: "Copyright © 2025 The Kicks Lab • Developed by The Dev"
- [ ] Mobile navbar: hamburger menu, nav links in dropdown

## Technical Notes

### Convex
- Not used in this feature (guest-only state via Zustand)
- Convex cart/wishlist sync added in Phase 3 when Clerk auth is wired

### Clerk
- Auth required: No
- UserButton rendered in navbar — shows sign in / user avatar

### Cloudinary
- Images needed: No — product images in drawers use next/image with public/assets paths for now

### Resend
- Email trigger: No

### Components needed
- components/Navbar.tsx
- components/CartDrawer.tsx
- components/WishlistDrawer.tsx
- components/Footer.tsx
- lib/cartStore.ts (Zustand)
- lib/wishlistStore.ts (Zustand)
- app/layout.tsx (mount Navbar + Footer + both drawers)

## Acceptance Criteria
- [ ] Works on mobile (375px) — hamburger opens/closes nav
- [ ] Works on desktop (1280px)
- [ ] Cart badge shows correct count
- [ ] Wishlist badge shows correct count
- [ ] Cart drawer opens/closes, items add/remove correctly
- [ ] Wishlist drawer opens/closes, items add/remove, Add to Cart works
- [ ] Empty states show correctly in both drawers
- [ ] Footer renders all 4 columns correctly
- [ ] Footer collapses to single column on mobile
- [ ] State persists on page refresh (localStorage)
- [ ] npm run build passes

## Status
Not Started

## Notes
- Use Shadcn Sheet component for both drawers (replaces custom fixed overlay)
- Zustand persist middleware for localStorage
- Cart item shape: { id, slug, name, image, size, price, quantity }
- Wishlist item shape: { id, slug, name, image, price }
- Checkout button links to /checkout but page doesn't exist yet — that's fine
- next/image requires width + height props — use width={80} height={80} for drawer thumbnails
- Copy public/assets/main-logo.png and public/assets/icons-images/ from old project

## History