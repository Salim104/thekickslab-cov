"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { useCartStore, type CartItem } from "./cartStore";
import { useConvexUserId } from "./useConvexUserId";

// A single cart line, normalised across the two backends so the UI doesn't care
// whether it came from Convex (signed in) or localStorage (guest).
export type UnifiedCartItem = {
  key: string;
  cartId?: Id<"carts">;
  productId: string;
  slug: string;
  name: string;
  image: string;
  size: string;
  price: number;
  quantity: number;
};

// Unified cart: reads/writes Convex for signed-in users, Zustand+localStorage for
// guests. All hooks below are called unconditionally; only the returned object
// branches on auth, so hook order stays stable.
export function useCart() {
  const userId = useConvexUserId();
  const signedIn = userId !== null;

  // Guest (Zustand) — selectors subscribe so the UI stays reactive.
  const guestItems = useCartStore((s) => s.items);
  const guestTotalItems = useCartStore((s) => s.totalItems);
  const guestTotalAmount = useCartStore((s) => s.totalAmount);
  const guestAdd = useCartStore((s) => s.addItem);
  const guestRemove = useCartStore((s) => s.removeItem);
  const guestUpdate = useCartStore((s) => s.updateQuantity);
  const guestClear = useCartStore((s) => s.clearCart);

  // Convex.
  const convexRows = useQuery(api.carts.getByUser, userId ? { userId } : "skip");
  const addItemM = useMutation(api.carts.addItem);
  const removeM = useMutation(api.carts.remove);
  const updateM = useMutation(api.carts.updateQuantity);
  const clearM = useMutation(api.carts.clearByUser);

  if (signedIn) {
    const rows = convexRows ?? [];
    const items: UnifiedCartItem[] = rows.map((r) => ({
      key: r.cartId,
      cartId: r.cartId,
      productId: r.product._id,
      slug: r.product.slug,
      name: r.product.name,
      image: r.product.images?.[0] ?? "",
      size: r.size,
      price: r.product.price,
      quantity: r.quantity,
    }));
    return {
      items,
      totalItems: items.reduce((s, i) => s + i.quantity, 0),
      totalAmount: items.reduce((s, i) => s + i.price * i.quantity, 0),
      loading: convexRows === undefined,
      addItem: (item: Omit<CartItem, "quantity">, quantity = 1) =>
        addItemM({
          userId,
          productId: item.id as Id<"products">,
          size: item.size,
          quantity,
        }),
      removeItem: (item: UnifiedCartItem) =>
        item.cartId ? removeM({ id: item.cartId }) : undefined,
      updateQuantity: (item: UnifiedCartItem, quantity: number) =>
        item.cartId ? updateM({ id: item.cartId, quantity }) : undefined,
      clear: () => clearM({ userId }),
    };
  }

  const items: UnifiedCartItem[] = guestItems.map((i) => ({
    key: `${i.id}-${i.size}`,
    productId: i.id,
    slug: i.slug,
    name: i.name,
    image: i.image,
    size: i.size,
    price: i.price,
    quantity: i.quantity,
  }));
  return {
    items,
    totalItems: guestTotalItems,
    totalAmount: guestTotalAmount,
    loading: false,
    addItem: (item: Omit<CartItem, "quantity">, quantity = 1) =>
      guestAdd(item, quantity),
    removeItem: (item: UnifiedCartItem) => guestRemove(item.productId, item.size),
    updateQuantity: (item: UnifiedCartItem, quantity: number) =>
      guestUpdate(item.productId, item.size, quantity),
    clear: () => guestClear(),
  };
}
