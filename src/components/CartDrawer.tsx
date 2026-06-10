"use client";

import Link from "next/link";
import Image from "next/image";
import { Trash2, ShoppingBag } from "lucide-react";

import { formatZAR } from "@/lib/utils";
import { useCartStore } from "@/lib/cartStore";
import { useUIStore } from "@/lib/uiStore";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";

export default function CartDrawer() {
  const open = useUIStore((s) => s.cartOpen);
  const setOpen = useUIStore((s) => s.setCartOpen);

  const items = useCartStore((s) => s.items);
  const totalItems = useCartStore((s) => s.totalItems);
  const totalAmount = useCartStore((s) => s.totalAmount);
  const removeItem = useCartStore((s) => s.removeItem);
  const clearCart = useCartStore((s) => s.clearCart);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="flex w-full flex-col bg-white p-0 sm:max-w-md">
        <SheetHeader className="border-b border-neutral-200">
          <SheetTitle className="text-base">Your Cart ({totalItems})</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <ShoppingBag className="h-12 w-12 text-neutral-300" />
            <p className="text-sm text-neutral-500">Your cart is empty</p>
            <Button asChild variant="outline" onClick={() => setOpen(false)}>
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-4">
              <ul className="divide-y divide-neutral-100">
                {items.map((item) => (
                  <li
                    key={`${item.id}-${item.size}`}
                    className="flex gap-3 py-4"
                  >
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-neutral-50">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <p className="line-clamp-2 text-sm font-medium text-neutral-900">
                          {item.name}
                        </p>
                        {item.size && (
                          <p className="mt-0.5 text-xs text-neutral-500">
                            Size: {item.size}
                          </p>
                        )}
                      </div>
                      <p className="text-sm text-neutral-700">
                        {item.quantity} × {formatZAR(item.price)}
                      </p>
                    </div>
                    <button
                      type="button"
                      aria-label={`Remove ${item.name}`}
                      onClick={() => removeItem(item.id, item.size)}
                      className="self-start rounded-md p-1.5 text-neutral-400 transition-colors hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <SheetFooter className="border-t border-neutral-200">
              <div className="flex items-center justify-between text-sm font-medium text-neutral-900">
                <span>Subtotal</span>
                <span>{formatZAR(totalAmount)}</span>
              </div>
              <Button asChild className="w-full bg-neutral-900 text-white hover:bg-neutral-800">
                {/* /checkout doesn't exist yet — added in a later phase */}
                <Link href="/checkout">Checkout</Link>
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={clearCart}
              >
                Clear Cart
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
