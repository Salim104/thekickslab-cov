import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Next 16 renamed the `middleware` file convention to `proxy` (middleware is
// deprecated). Clerk 7 is Next-16-aware and runs `clerkMiddleware()` from either
// `middleware.ts` or `proxy.ts`, so this lives at `src/proxy.ts`.

// Routes that require a signed-in user. `/admin(.*)` additionally requires the
// "admin" role — but that check needs the Convex user record, so it lives in the
// admin layout (a Server Component that can query Convex), not here.
const isProtectedRoute = createRouteMatcher(["/account(.*)", "/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    const { userId } = await auth();
    if (!userId) {
      const signInUrl = new URL("/sign-in", req.url);
      // Preserve where the user was headed so Clerk can return them after login.
      signInUrl.searchParams.set("redirect_url", req.url);
      return NextResponse.redirect(signInUrl);
    }
  }
});

export const config = {
  matcher: [
    // Skip Next internals and all static assets unless found in search params.
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API/TRPC routes.
    "/(api|trpc)(.*)",
  ],
};
