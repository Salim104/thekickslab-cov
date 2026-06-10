@AGENTS.md

# The Kicks Lab

A sneaker e-commerce store for a South African client. Single seller, no marketplace.

## Context Files

Read the following to get the full context of the project:

- @context/project-overview.md
- @context/current-feature.md

## Commands

- **Dev server**: `npm run dev` (runs on http://localhost:3000)
- **Convex dev**: `npx convex dev` (must be running alongside dev server)
- **Build**: `npm run build`
- **Production server**: `npm run start`
- **Lint**: `npm run lint`

## Convex

- All database logic lives in the `convex/` folder
- Queries and mutations are called via `api.[table].[function]`
- Environment variables must be set via `npx convex env set KEY value` — not `.env.local`
- Do NOT run `convex dev` and `convex deploy` at the same time

## Clerk

- Auth is required for cart and wishlist persistence
- Guest users use Zustand + localStorage for cart and wishlist
- On login, guest cart merges into Convex cart
- Webhook syncs Clerk user to Convex `users` table via svix
- Protected routes: `/account/*` only

## Payments

- Stripe — Phase 3, not started
- Do NOT add any payment logic until instructed

## Git Rules

- Branch off `dev` for every feature: `git checkout dev && git checkout -b feature/xxx`
- Never commit directly to `main` or `dev`
- Merge to `dev` first, test on Vercel preview, then merge to `main`
- Do not add Claude to any commit messages

## Rules

- All prices in ZAR formatted as R1799.99 (no space after R)
- Use next/image or CldImage (next-cloudinary) for all images — never <img>
- Use next/link for all internal navigation — never <a>
- No Prisma, no MongoDB — Convex only
- No hardcoded product data — Convex is the only data source
- Single shared ProductCard component — do not create multiple versions
- TypeScript strict mode off — keep it approachable
- Always handle loading states with Shadcn Skeleton
- Always handle empty states with a message + CTA