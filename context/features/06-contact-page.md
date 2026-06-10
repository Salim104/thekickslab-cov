# Feature: Contact Page

## Description
Contact form at /contact that submits via Server Action to Resend.
Three info cards below the form. Matches old UI exactly.

## Design Reference
- UI reference: old project src/pages/Contact.jsx
- Key design decisions:
  - max-w-3xl mx-auto centered layout
  - "Contact Us" h1 text-3xl font-bold text-center
  - White card with shadow wrapping the form (bg-white p-8 rounded-lg shadow-md)
  - Form fields: Name + Email side by side (2-col grid), Subject full width, Message textarea (6 rows)
  - Submit button: bg-black hover:bg-red-600, "Send Message"
  - Below form: 3 info cards side by side — Email Us, Call Us, Location
  - Each info card: bg-white p-6 rounded-lg shadow-md text-center, bold title + gray text

## Requirements
- [ ] /contact route
- [ ] "Contact Us" h1 centered
- [ ] Form: Name (placeholder "John Doe"), Email (placeholder "johndoe@example.com"), Subject (placeholder "Order Inquiry"), Message textarea 6 rows
- [ ] All fields required — Zod validation
- [ ] Inline validation errors below each field
- [ ] Submit button: bg-black hover:bg-red-600, loading spinner while submitting
- [ ] Server Action sends email via Resend on submit
- [ ] Success toast: "Message sent! We'll get back to you soon."
- [ ] Error toast: "Something went wrong. Please try again."
- [ ] 3 info cards below:
  - Email Us — info@thekickslab.com
  - Call Us — +27 12 345 6789
  - Location — 123 Sneaker Street, Cape Town, South Africa

## Technical Notes

### Convex
- Not used in this feature

### Clerk
- Auth required: No

### Cloudinary
- Images needed: No

### Resend
- Email trigger: Yes — on form submit
- Server Action: app/actions/sendContactEmail.ts
- Send to: process.env.RESEND_TO_EMAIL
- React Email template: emails/ContactEmail.tsx
- Template fields: name, email, subject, message
- From: "The Kicks Lab <onboarding@resend.dev>" (until custom domain verified)

### Components needed
- app/contact/page.tsx — server component shell
- components/ContactForm.tsx — "use client", react-hook-form + Zod, calls Server Action
- app/actions/sendContactEmail.ts — Server Action, calls Resend
- emails/ContactEmail.tsx — React Email template

## Acceptance Criteria
- [ ] Works on mobile (375px) — form fields stack to 1 column, info cards stack
- [ ] Works on desktop (1280px) — 2-col name/email, 3-col info cards
- [ ] All fields validate on submit — errors shown inline
- [ ] Email arrives in RESEND_TO_EMAIL inbox
- [ ] Success toast shows on send
- [ ] Error toast shows on failure
- [ ] Loading state on button while submitting
- [ ] npm run build passes

## Status
Not Started

## Notes
- Use Shadcn Form + react-hook-form + Zod for validation
- Use Shadcn Toaster + toast() for success/error feedback
- Add RESEND_TO_EMAIL=info@thekickslab.com to .env.local
- focus:ring-red-500 on all inputs (matches old design)

## History