# Project Overview: The Kicks Lab

## Client
The Kicks Lab

## Project Type
E-commerce sneaker store (single seller, no marketplace)

## Live URL
https://thekickslab.vercel.app

## Staging URL
https://thekickslab-dev.vercel.app (Vercel dev branch preview)

## Stack
- Next.js 15 App Router (TypeScript)
- Shadcn/ui + Tailwind CSS v3
- Clerk (authentication)
- Convex (database)
- Cloudinary (product images via next-cloudinary)
- Resend (transactional email)
- Vercel (hosting)
- Stripe (payments — Phase 3, not started)

## Brand
- Primary: Dark navy (#0F172A)
- Accent: Red (#EF4444)
- Text: White on dark, dark on light
- Font: Inter (Google Fonts via next/font)

## Currency
South African Rand — ZAR (R1799.99 format)

## Phases

### Phase 1 — Foundation
- Project scaffold + Convex schema + seed data
- Clerk auth setup
- Cloudinary setup

### Phase 2 — Storefront
- Navbar + Cart Drawer + Wishlist Drawer
- Homepage (Hero, Features, Best Selling, Deals, Shop All)
- Shop page (grid + filters)
- Product Detail page
- Contact page
- Footer

### Phase 3 — Commerce (future)
- Stripe payments
- Orders table + order confirmation
- Order confirmation email (Resend)
- Admin dashboard

## Convex Schema

### products
- name: string
- brand: string
- slug: string
- price: number
- originalPrice: number
- discountPercent: number
- images: string[] (Cloudinary URLs)
- category: string
- sizes: string[]
- inStock: boolean
- isBestSeller: boolean
- isOnDeal: boolean

### users (synced from Clerk webhook)
- clerkId: string
- email: string
- name: string
- role: "customer" | "admin"

### wishlists
- userId: Id<"users">
- productId: Id<"products">

### carts
- userId: Id<"users">
- productId: Id<"products">
- size: string
- quantity: number

## Git Branches
- main → production (thekickslab.vercel.app)
- dev → staging (preview URL)
- feature/xxx → one branch per feature, off dev

## Env Vars
- NEXT_PUBLIC_CONVEX_URL
- NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
- CLERK_SECRET_KEY
- NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
- RESEND_API_KEY

## Notes
- Payments deferred to Phase 3 (Stripe)
- Cart and Wishlist persisted to Convex for logged-in users
- All prices in ZAR
- No TypeScript strict mode (keep it approachable)