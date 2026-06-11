# Feature: Stripe Payments + Checkout

## Description
Multi-step checkout flow: cart review → shipping details → Stripe payment.
Order saved to Convex on payment success. Confirmation emails sent to
customer and admin via Resend. Stripe test mode first.

## Routes
- /checkout → multi-step checkout page
- /checkout/success → order confirmation page
- /checkout/cancelled → cancelled/failed page
- /api/stripe/create-payment-intent → Server Action/API route
- /api/stripe/webhook → Stripe webhook handler

## Checkout Steps
1. **Cart Review** — list of items, quantities, subtotal
2. **Shipping Details** — name, email, phone, address form
3. **Payment** — Stripe Elements card input, order summary, pay button

## Requirements

### Step 1 — Cart Review
- [ ] List all cart items: thumbnail, name, size, quantity, price
- [ ] Quantity adjust: increment/decrement per item
- [ ] Remove item button per row
- [ ] Subtotal calculation (ZAR)
- [ ] Shipping: "Calculated at next step" placeholder
- [ ] Order total = subtotal (no shipping calc yet)
- [ ] "Proceed to Shipping" button → Step 2
- [ ] Empty cart state: "Your cart is empty" + Shop Now → /shop
- [ ] Back to cart: "← Continue Shopping" link → /shop

### Step 2 — Shipping Details
- [ ] Fields: First Name, Last Name, Email, Phone, Address Line 1, Address Line 2 (optional), City, Province, Postal Code
- [ ] Province: dropdown — Gauteng, Western Cape, KwaZulu-Natal, Eastern Cape, Limpopo, Mpumalanga, North West, Free State, Northern Cape
- [ ] All fields required except Address Line 2
- [ ] Zod validation, inline errors
- [ ] Order summary sidebar: items count + subtotal
- [ ] "Proceed to Payment" button → Step 3
- [ ] "← Back to Cart" button → Step 1

### Step 3 — Payment
- [ ] Stripe Elements: card number, expiry, CVC inputs (custom styled)
- [ ] Order summary: item list + subtotal + shipping (TBD) + total
- [ ] "Pay R{total}" button — triggers Stripe payment intent
- [ ] Loading state on pay button while processing
- [ ] On success → /checkout/success
- [ ] On failure → show error message inline (do not redirect)
- [ ] "← Back to Shipping" → Step 2

### Order Success Page (/checkout/success)
- [ ] "Order Confirmed! 🎉" heading
- [ ] Order number (from Convex)
- [ ] Summary: items, shipping address, total paid
- [ ] "Continue Shopping" → /shop
- [ ] "View My Orders" → /account (orders tab)

### Order Cancelled Page (/checkout/cancelled)
- [ ] "Payment Cancelled" heading
- [ ] "Your cart has been saved" message
- [ ] "Try Again" → /checkout
- [ ] "Continue Shopping" → /shop

### Convex Orders Table
- [ ] Schema:
  - userId: optional Id<"users"> (null for guest checkout)
  - orderNumber: string (auto-generated: TKL-YYYYMMDD-XXXX)
  - items: array of { productId, name, image, size, quantity, price }
  - shipping: { firstName, lastName, email, phone, address1, address2, city, province, postalCode }
  - subtotal: number
  - total: number
  - status: "pending" | "paid" | "shipped" | "delivered" | "cancelled"
  - stripePaymentIntentId: string
  - createdAt: number

### Stripe Integration
- [ ] Server Action: app/actions/createPaymentIntent.ts
  - Creates Stripe PaymentIntent in ZAR (amount in cents)
  - Returns clientSecret
- [ ] Stripe webhook: app/api/stripe/webhook/route.ts
  - Listens for payment_intent.succeeded
  - Creates order in Convex on success
  - Triggers Resend emails (customer + admin)
- [ ] Stripe test mode: STRIPE_SECRET_KEY + STRIPE_WEBHOOK_SECRET in .env.local
- [ ] NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY for Stripe Elements on client

### Resend Emails
- [ ] Customer confirmation email:
  - To: customer email from shipping details
  - Subject: "Order Confirmed — TKL-XXXX"
  - Template: order number, items list, shipping address, total
  - Brand styled: black header, red accents
- [ ] Admin notification email:
  - To: RESEND_TO_EMAIL (env var)
  - Subject: "New Order — TKL-XXXX"
  - Template: same as customer but with customer contact info prominent

### Admin Orders Table (/admin/orders)
- [ ] Replace placeholder with real Shadcn DataTable
- [ ] Columns: Order #, Customer, Items, Total, Status, Date, Actions
- [ ] Status dropdown per row: pending → paid → shipped → delivered → cancelled
- [ ] Search by order number or customer name
- [ ] Pagination: 10 rows per page

## Technical Notes

### Convex
- New table: orders (schema above)
- Mutation: api.orders.create — called from Stripe webhook
- Query: api.orders.getAll — for admin table
- Query: api.orders.getByUser — for /account orders tab
- Query: api.orders.getByOrderNumber — for success page

### Clerk
- Auth required: No — guest checkout allowed
- If signed in: attach userId to order

### Cloudinary
- Images needed: No

### Resend
- Email trigger: Yes — customer + admin on payment_intent.succeeded
- Templates: emails/OrderConfirmationEmail.tsx, emails/AdminOrderEmail.tsx

### Components needed
- app/checkout/page.tsx — multi-step shell, manages currentStep state
- components/checkout/CartReview.tsx — step 1
- components/checkout/ShippingForm.tsx — step 2, react-hook-form + Zod
- components/checkout/PaymentForm.tsx — step 3, Stripe Elements
- components/checkout/OrderSummary.tsx — sidebar summary (reused in steps 2+3)
- components/checkout/StepIndicator.tsx — "1 Cart → 2 Shipping → 3 Payment" progress bar
- app/checkout/success/page.tsx
- app/checkout/cancelled/page.tsx
- app/actions/createPaymentIntent.ts — Server Action
- app/api/stripe/webhook/route.ts — Stripe webhook
- emails/OrderConfirmationEmail.tsx
- emails/AdminOrderEmail.tsx
- Update app/admin/orders/page.tsx — replace placeholder with real table
- Update app/account/page.tsx — orders tab now shows real orders

## Acceptance Criteria
- [ ] Step indicator shows current step correctly
- [ ] Step 1: cart items show, quantity adjust works, remove works
- [ ] Step 2: all fields validate, province dropdown works
- [ ] Step 3: Stripe test card 4242 4242 4242 4242 processes successfully
- [ ] On success: order saved to Convex with correct data
- [ ] On success: customer receives confirmation email
- [ ] On success: admin receives notification email
- [ ] Order number format: TKL-YYYYMMDD-XXXX
- [ ] /checkout/success shows correct order details
- [ ] /admin/orders shows real orders, status update works
- [ ] /account orders tab shows user's orders
- [ ] Guest checkout works (no Clerk auth required)
- [ ] Works on mobile (375px)
- [ ] Works on desktop (1280px)
- [ ] npm run build passes

## Status
Not Started

## Notes
- Stripe amount must be in cents: R1799.99 → 179999
- ZAR currency code: "zar"
- Test card: 4242 4242 4242 4242, any future expiry, any CVC
- Stripe webhook needs local tunnel for dev testing:
  Use Stripe CLI: stripe listen --forward-to localhost:3000/api/stripe/webhook
- Install: npm install @stripe/stripe-js @stripe/react-stripe-js stripe
- STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET in .env.local (not Convex env)
- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in .env.local
- Order number generation: `TKL-${YYYYMMDD}-${Math.random().toString(36).substr(2,4).toUpperCase()}`

## History