"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

// Resolves the Convex `users._id` for the signed-in Clerk user, or null when
// signed out / not yet synced (the webhook creates the row). Identical Convex
// queries are deduped, so calling this from several hooks is cheap.
export function useConvexUserId() {
  const { isSignedIn, user } = useUser();
  const convexUser = useQuery(
    api.users.getByClerkId,
    isSignedIn && user ? { clerkId: user.id } : "skip"
  );
  return convexUser?._id ?? null;
}
