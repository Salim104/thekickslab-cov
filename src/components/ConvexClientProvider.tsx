"use client";

import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useAuth } from "@clerk/nextjs";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// ConvexProviderWithClerk forwards the signed-in user's Clerk JWT to Convex on
// every request, so server-side mutations can authenticate the caller via
// `ctx.auth.getUserIdentity()`. Must be rendered inside <ClerkProvider> (it is —
// see layout.tsx). Guests simply send no token (ctx.auth is null for them).
export default function ConvexClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      {children}
    </ConvexProviderWithClerk>
  );
}
