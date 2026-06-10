"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import ProductCard from "@/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function AccountWishlist({
  convexUserId,
}: {
  convexUserId: Id<"users"> | null;
}) {
  const items = useQuery(
    api.wishlists.getByUser,
    convexUserId ? { userId: convexUserId } : "skip"
  );
  const removeItem = useMutation(api.wishlists.remove);

  // No Convex user yet (e.g. webhook hasn't synced) — nothing to show.
  if (!convexUserId) return <EmptyState />;

  // Loading.
  if (items === undefined) {
    return (
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-72 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (items.length === 0) return <EmptyState />;

  const handleRemove = async (wishlistId: Id<"wishlists">) => {
    try {
      await removeItem({ id: wishlistId });
      toast.success("Removed from wishlist");
    } catch {
      toast.error("Couldn't remove item. Please try again.");
    }
  };

  return (
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
      {items.map(({ wishlistId, product }) => (
        <div key={wishlistId} className="relative">
          <button
            type="button"
            aria-label="Remove from wishlist"
            onClick={() => handleRemove(wishlistId)}
            className="absolute right-2 top-2 z-20 rounded-full bg-white/90 p-2 text-gray-600 shadow-sm transition-colors hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 py-16 text-center">
      <p className="mb-4 text-gray-600">No saved items yet</p>
      <Link
        href="/shop"
        className="rounded-md bg-black px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600"
      >
        Shop Now
      </Link>
    </div>
  );
}
