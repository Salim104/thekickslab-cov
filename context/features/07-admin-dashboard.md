# Feature: Admin Dashboard

## Description
Protected admin area at /admin for managing products, orders, and users.
Multiple staff members with admin role via Clerk.
Clean Shadcn data table UI throughout.

## Design Reference
- Style: Shadcn data table, clean minimal, white bg, sidebar nav
- No public-facing design reference — greenfield admin UI

## Routes
- /admin → redirects to /admin/products
- /admin/products → products data table
- /admin/products/new → add product form
- /admin/products/[slug]/edit → edit product form
- /admin/orders → orders data table (Phase 3 placeholder for now)
- /admin/users → users data table

## Requirements

### Layout
- [ ] /admin layout: sidebar left + main content right
- [ ] Sidebar: The Kicks Lab logo, nav links (Products, Orders, Users), sign out button
- [ ] Top bar: page title + primary action button (e.g. "Add Product")
- [ ] Clerk middleware protects all /admin/* routes — redirect to /sign-in if not authenticated
- [ ] Only users with role: "admin" in Convex can access — redirect others to /

### Products Table (/admin/products)
- [ ] Shadcn DataTable with columns: Image (thumbnail), Name, Brand, Category, Price, Original Price, Discount %, In Stock, Best Seller, On Deal, Actions
- [ ] Actions column: Edit button → /admin/products/[slug]/edit, Delete button (confirm dialog)
- [ ] Search input above table — filters by name in real time
- [ ] "Add Product" button top right → /admin/products/new
- [ ] Delete: Convex mutation with Shadcn AlertDialog confirm
- [ ] Pagination: 10 rows per page

### Product Form (Add + Edit)
- [ ] Fields:
  - Name (text input, required)
  - Brand (text input, required)
  - Slug (text input, required, auto-generated from name, editable)
  - Category (text input, required)
  - Sale Price / R (number input, required)
  - Original Price / R (number input, required)
  - Discount % (number input, auto-calculated from prices, editable)
  - Sizes (multi-select tag input: 6, 7, 8, 9, 10, 11, 12)
  - In Stock (toggle switch)
  - Is Best Seller (toggle switch)
  - Is On Deal (toggle switch)
  - Images (custom Cloudinary upload — see below)
- [ ] Save button: creates/updates product in Convex
- [ ] Cancel button: back to /admin/products
- [ ] Slug auto-generates from name as user types (kebab-case), remains editable
- [ ] Discount % auto-calculates: Math.round((1 - salePrice/originalPrice) * 100)

### Custom Image Upload Popup
- [ ] "Manage Images" button opens a custom modal (not Shadcn Dialog — build custom)
- [ ] Modal shows current product images as thumbnails in a grid
- [ ] "Upload Image" button inside modal triggers Cloudinary upload widget (next-cloudinary CldUploadWidget)
- [ ] Uploaded image appears in grid immediately
- [ ] Each thumbnail has a delete (×) button to remove from images[]
- [ ] "Done" button closes modal, images[] updated in form state
- [ ] Modal: fixed overlay, white card, centered, max-w-2xl

### Users Table (/admin/users)
- [ ] Shadcn DataTable: columns: Name, Email, Role, Joined, Actions
- [ ] Actions: toggle role between "customer" and "admin" (Convex mutation)
- [ ] Search input above table — filters by name or email
- [ ] Pagination: 10 rows per page

### Orders Table (/admin/orders)
- [ ] Placeholder page for now: "Orders coming in Phase 3" message
- [ ] Same layout/sidebar as other admin pages

## Technical Notes

### Convex
- Query: api.products.getAll — existing, used for table
- Mutation: api.products.create — creates new product
- Mutation: api.products.update — updates product by id
- Mutation: api.products.delete — deletes product by id
- Query: api.users.getAll — returns all users
- Mutation: api.users.updateRole — toggles role field

### Clerk
- Auth required: Yes — middleware.ts protects /admin/*
- Role check: read role from Convex users table by clerkId
- If not admin → redirect to /

### Cloudinary
- Images needed: Yes — CldUploadWidget from next-cloudinary in custom modal
- On upload success: push returned secure_url to images[] form state

### Resend
- Email trigger: No

### Components needed
- app/admin/layout.tsx — sidebar + top bar, role check
- app/admin/products/page.tsx — products data table
- app/admin/products/new/page.tsx — add product form
- app/admin/products/[slug]/edit/page.tsx — edit product form
- app/admin/users/page.tsx — users data table
- app/admin/orders/page.tsx — placeholder
- components/admin/ProductsTable.tsx — Shadcn DataTable for products
- components/admin/ProductForm.tsx — "use client", full product form with slug auto-gen + discount calc
- components/admin/ImageUploadModal.tsx — custom modal with CldUploadWidget
- components/admin/UsersTable.tsx — Shadcn DataTable for users
- components/admin/AdminSidebar.tsx — sidebar nav

## Acceptance Criteria
- [ ] /admin/* redirects to /sign-in if not authenticated
- [ ] Non-admin users redirected to / 
- [ ] Products table loads all products from Convex
- [ ] Add product creates new product, appears in table
- [ ] Edit product updates correctly in Convex
- [ ] Delete product removes with confirm dialog
- [ ] Slug auto-generates from name
- [ ] Discount % auto-calculates from prices
- [ ] Image upload modal opens, uploads to Cloudinary, shows thumbnail
- [ ] Image delete removes from images[] in form
- [ ] Users table loads all users, role toggle works
- [ ] Works on desktop (1280px) — admin is desktop only, no mobile requirement
- [ ] npm run build passes

## Status
Not Started

## Notes
- Admin is desktop-only — no mobile layout required
- Sizes field: tag-style multi-select (UK sizes 6–12)
- First admin user: set role: "admin" manually in Convex dashboard for client's account
- CldUploadWidget requires NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME in .env.local (already set)
- Shadcn DataTable requires installing @tanstack/react-table: npx shadcn@latest add table

## History