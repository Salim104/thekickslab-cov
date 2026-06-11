# Feature: Clerk Auth

## Description
Full authentication flow with custom styled sign-in/sign-up pages,
protected account page, cart/wishlist merge on login, and profile
icon behaviour based on auth state.

## Design Reference
- Style: matches The Kicks Lab brand — black, white, red-600 accents
- Sign in/up: centered card, white bg, shadow, logo top, brand colors
- Account page: clean profile layout, 3 sections (Profile, Wishlist, Orders)

## Routes
- /sign-in → custom Clerk sign in page
- /sign-up → custom Clerk sign up page
- /account → protected, logged-in users only
- /account/wishlist → saved wishlist items
- /account/orders → order history (placeholder until Stripe)

## Requirements

### Sign In Page (/sign-in)
- [ ] Custom styled Clerk <SignIn /> component
- [ ] Centered card layout, max-w-md, white bg, rounded-lg shadow
- [ ] The Kicks Lab logo above the form
- [ ] Clerk appearance prop: primary color red-600 (#DC2626), font Inter
- [ ] After sign in → redirect to homepage (/)
- [ ] Link to /sign-up below form

### Sign Up Page (/sign-up)
- [ ] Custom styled Clerk <SignUp /> component
- [ ] Same card layout as sign in
- [ ] After sign up → redirect to homepage (/)
- [ ] Clerk webhook creates user in Convex users table on sign up
- [ ] Link to /sign-in below form

### Clerk Webhook (user sync)
- [ ] convex/users.ts → createFromClerk mutation
- [ ] Triggered by Clerk webhook event: user.created
- [ ] Creates user in Convex: clerkId, email, name, role: "customer"
- [ ] Webhook secret stored as CLERK_WEBHOOK_SECRET in env
- [ ] Webhook endpoint: app/api/clerk-webhook/route.ts
- [ ] Verify webhook signature using svix

### Navbar Profile Icon
- [ ] Not signed in → clicking profile icon navigates to /sign-in
- [ ] Signed in → profile icon replaced by Clerk <UserButton />
- [ ] UserButton afterSignOutUrl: "/"

### Account Page (/account)
- [ ] Protected by middleware — redirect to /sign-in if not authenticated
- [ ] 3 tabs: Profile, Wishlist, Orders
- [ ] Profile tab:
  - Avatar (Clerk user image)
  - Full name (from Clerk)
  - Email (from Clerk)
  - Member since date (from Convex user createdAt)
- [ ] Wishlist tab:
  - Grid of saved wishlist items from Convex (api.wishlists.getByUser)
  - Each item: ProductCard with remove from wishlist button
  - Empty state: "No saved items yet" + Shop Now → /shop
- [ ] Orders tab:
  - Placeholder: "Your orders will appear here once you make a purchase"
  - Same empty state style as wishlist

### Cart + Wishlist Merge on Login
- [ ] On sign in: read localStorage cart (Zustand cartStore)
- [ ] Merge each localStorage cart item into Convex cart (api.carts.addItem)
- [ ] Clear localStorage cart after merge
- [ ] Same merge flow for wishlist (Zustand wishlistStore → api.wishlists.addItem)
- [ ] Merge logic runs once in a useEffect triggered by auth state change
- [ ] Lives in a client component: components/AuthMergeProvider.tsx

## Technical Notes

### Convex
- Mutation: api.users.createFromClerk — clerkId, email, name, role: "customer"
- Query: api.users.getByClerkId — returns Convex user by clerkId
- Query: api.wishlists.getByUser — returns wishlist items for logged-in user
- Mutation: api.wishlists.addItem — adds item to Convex wishlist
- Mutation: api.carts.addItem — adds item to Convex cart
- Query: api.carts.getByUser — returns cart items for logged-in user

### Clerk
- Auth required: Yes — /account/* protected in middleware.ts
- Custom appearance on SignIn + SignUp via appearance prop
- UserButton shown in Navbar when signed in
- Webhook: user.created → convex/users.ts createFromClerk
- afterSignInUrl: "/"
- afterSignUpUrl: "/"

### Cloudinary
- Images needed: No

### Resend
- Email trigger: No

### Components needed
- app/sign-in/[[...sign-in]]/page.tsx — custom SignIn page
- app/sign-up/[[...sign-up]]/page.tsx — custom SignUp page
- app/account/page.tsx — protected account page with tabs
- app/account/layout.tsx — auth guard, redirect if not signed in
- app/api/clerk-webhook/route.ts — webhook handler with svix verification
- components/AuthMergeProvider.tsx — "use client", handles cart/wishlist merge on login
- Update components/Navbar.tsx — profile icon logic based on auth state

## Acceptance Criteria
- [ ] /sign-in loads custom styled Clerk SignIn component
- [ ] /sign-up loads custom styled Clerk SignUp component
- [ ] Sign in redirects to / on success
- [ ] Sign up creates user in Convex via webhook, redirects to /
- [ ] Profile icon → /sign-in when logged out
- [ ] Profile icon → Clerk UserButton when logged in
- [ ] /account redirects to /sign-in if not authenticated
- [ ] Account Profile tab shows correct user info
- [ ] Account Wishlist tab shows Convex wishlist items
- [ ] Account Orders tab shows placeholder
- [ ] Guest cart merges into Convex on login
- [ ] Guest wishlist merges into Convex on login
- [ ] localStorage cart/wishlist cleared after merge
- [ ] npm run build passes

## Status
Not Started

## Notes
- Clerk webhook must be configured in Clerk dashboard:
  - Development: use ngrok or Cloudflare tunnel to expose localhost
  - Production: https://thekickslab.vercel.app/api/clerk-webhook
- CLERK_WEBHOOK_SECRET set via: npx convex env set CLERK_WEBHOOK_SECRET value
- svix already installed (was in original dependencies)
- middleware.ts: add /account(.*) to protected routes, keep /admin(.*) protected
- Safe migration: existing seeded users in Convex won't break — webhook only fires for new signups
- First admin user: after signing up, manually set role: "admin" in Convex dashboard

## History