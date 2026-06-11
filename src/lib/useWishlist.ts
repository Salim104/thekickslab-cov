"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { useWishlistStore, type WishlistItem } from "./wishlistStore";
import { useConvexUserId } from "./useConvexUserId";

// A saved item, normalised across Convex (signed in) and localStorage (guest).
export type UnifiedWishlistItem = {
  key: string;
  wishlistId?: Id<"wishlists">;
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
};

// Unified wishlist mirroring useCart. `isInWishlist` is derived from the live
// item list so callers re-render when membership changes (the old store-getter
// approach didn't subscribe to item changes).
export function useWishlist() {
  const userId = useConvexUserId();
  const signedIn = userId !== null;

  // Guest (Zustand).
  const guestItems = useWishlistStore((s) => s.items);
  const guestTotalItems = useWishlistStore((s) => s.totalItems);
  const guestToggle = useWishlistStore((s) => s.toggleItem);
  const guestRemove = useWishlistStore((s) => s.removeItem);

  // Convex.
  const convexRows = useQuery(
    api.wishlists.getByUser,
    userId ? { userId } : "skip"
  );
  const addM = useMutation(api.wishlists.addItem);
  const removeByProductM = useMutation(api.wishlists.removeByProduct);

  if (signedIn) {
    const rows = convexRows ?? [];
    const items: UnifiedWishlistItem[] = rows.map((r) => ({
      key: r.wishlistId,
      wishlistId: r.wishlistId,
      productId: r.product._id,
      slug: r.product.slug,
      name: r.product.name,
      image: r.product.images?.[0] ?? "",
      price: r.product.price,
    }));
    const ids = new Set(items.map((i) => i.productId));
    return {
      items,
      totalItems: items.length,
      loading: convexRows === undefined,
      isInWishlist: (productId: string) => ids.has(productId),
      toggleItem: (item: WishlistItem) =>
        ids.has(item.id)
          ? removeByProductM({ userId, productId: item.id as Id<"products"> })
          : addM({ userId, productId: item.id as Id<"products"> }),
      removeItem: (productId: string) =>
        removeByProductM({ userId, productId: productId as Id<"products"> }),
    };
  }

  const items: UnifiedWishlistItem[] = guestItems.map((i) => ({
    key: i.id,
    productId: i.id,
    slug: i.slug,
    name: i.name,
    image: i.image,
    price: i.price,
  }));
  const ids = new Set(items.map((i) => i.productId));
  return {
    items,
    totalItems: guestTotalItems,
    loading: false,
    isInWishlist: (productId: string) => ids.has(productId),
    toggleItem: (item: WishlistItem) => guestToggle(item),
    removeItem: (productId: string) => guestRemove(productId),
  };
}
