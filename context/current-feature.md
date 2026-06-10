# Current Feature: Navbar + Cart Drawer + Wishlist Drawer + Footer (/layout)

## Feature File
`context/features/02-navbar-drawers-footer.md`

## What to Build
1. `lib/cartStore.ts` — Zustand cart store with localStorage persist (items, totalItems, totalAmount, addItem, removeItem, clearCart)
2. `lib/wishlistStore.ts` — Zustand wishlist store with localStorage persist (items, totalItems, addItem, removeItem, isInWishlist)
3. `components/Navbar.tsx` — Fixed top navbar with logo, links, icons, Clerk UserButton, opens cart/wishlist drawers
4. `components/CartDrawer.tsx` — Shadcn Sheet from right, cart items list, subtotal, clear + checkout buttons
5. `components/WishlistDrawer.tsx` — Shadcn Sheet from right, wishlist items, add to cart + remove buttons
6. `components/Footer.tsx` — Black 4-column footer with links and copyright bar
7. `app/layout.tsx` — Mount Navbar, Footer, CartDrawer, WishlistDrawer, ClerkProvider, ConvexProvider

## Build Order
Build in the order listed above — stores first so components can import them, layout last so it wires everything together.

## Design Reference
- UI reference: old project files pasted in planning chat
- Navbar: white bg, logo left, nav center, icons right
- Drawers: right slide-in, max-w-md, white bg
- Footer: black bg, 4 columns, collapses on mobile

## Notes
- Use `next/image` for logo and drawer product images — not `<img>`
- Use `next/link` for all nav links — not `<a>`
- Use Shadcn `Sheet` for both drawers — not custom fixed overlay
- Cart/Wishlist drawer open state lives in Navbar (useState), passed as props or use a simple Zustand UI store
- public/assets/ must be populated from old project before running Claude Code

## Status
`In Progress`

## History