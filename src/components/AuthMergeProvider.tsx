"use client";

import { useEffect, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { useCartStore } from "@/lib/cartStore";
import { useWishlistStore } from "@/lib/wishlistStore";
import { useConvexUserId } from "@/lib/useConvexUserId";

// Renders nothing. On login, merges the guest's localStorage cart + wishlist
// (Zustand) into Convex for the signed-in user, then clears localStorage.
//
// The merge waits until the Convex `users` row exists (created by the Clerk
// webhook). In local dev without a webhook tunnel that row may not exist yet —
// `getByClerkId` returns null, so we simply skip and keep localStorage intact
// until it does. localStorage is only cleared after a successful merge.
export default function AuthMergeProvider() {
  const userId = useConvexUserId();

  const addCartItem = useMutation(api.carts.addItem);
  const addWishlistItem = useMutation(api.wishlists.addItem);

  // Guard so the merge runs at most once per signed-in user.
  const mergedFor = useRef<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    if (mergedFor.current === userId) return;
    mergedFor.current = userId;

    const cart = useCartStore.getState();
    const wishlist = useWishlistStore.getState();
    const cartItems = cart.items;
    const wishlistItems = wishlist.items;
    if (cartItems.length === 0 && wishlistItems.length === 0) return;

    (async () => {
      try {
        await Promise.all([
          ...cartItems.map((i) =>
            addCartItem({
              userId,
              productId: i.id as Id<"products">,
              size: i.size,
              quantity: i.quantity,
            })
          ),
          ...wishlistItems.map((i) =>
            addWishlistItem({ userId, productId: i.id as Id<"products"> })
          ),
        ]);
        cart.clearCart();
        wishlist.clearWishlist();
      } catch (e) {
        // Leave localStorage intact and allow a retry on the next mount.
        mergedFor.current = null;
        console.error("Cart/wishlist merge failed:", e);
      }
    })();
  }, [userId, addCartItem, addWishlistItem]);

  return null;
}
