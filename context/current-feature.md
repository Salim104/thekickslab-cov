# Current Feature

## Feature File

## Goals

## Notes

## Status
`Not Started`

## History
- `Navbar + Cart Drawer + Wishlist Drawer + Footer` — built Zustand stores `cartStore.ts` (items, totalItems/totalAmount derived, addItem merges by id+size, removeItem, updateQuantity, clearCart, localStorage persist with totals recomputed on rehydrate) and `wishlistStore.ts` (items, totalItems, addItem/removeItem/toggleItem/isInWishlist, persist); added ephemeral `uiStore.ts` so navbar icons open the sibling drawers without prop-drilling; added `formatZAR` helper to `lib/utils.ts` (R1799.99, no space). Installed shadcn `sheet`. Built `Navbar.tsx` (sticky white bar, next/image logo, Home/Shop/Contact links, lucide search/wishlist/cart/profile icons with red count badges, mobile hamburger dropdown, mounted-guard for hydration), `CartDrawer.tsx` + `WishlistDrawer.tsx` (shadcn Sheet right slide-in `sm:max-w-md`, item rows, subtotal + Clear/Checkout, Add to Cart/Remove, empty states → /shop), `Footer.tsx` (black 4-column grid, collapses on mobile, copyright bar); mounted all four in `layout.tsx`. Clerk UserButton deferred (no Clerk keys in env) — used profile-icon placeholder. `npm run build` passes. Committed together with the project scaffold as the first real commit (no remote configured — not pushed). Status: `Complete`
