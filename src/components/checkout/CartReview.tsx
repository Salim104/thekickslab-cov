"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";

import { formatZAR } from "@/lib/utils";
import { useCart } from "@/lib/useCart";
import { Button } from "@/components/ui/button";

// Step 1 — review/edit the cart before checkout. Reads the unified cart so it
// works for both guests (localStorage) and signed-in users (Convex).
export default function CartReview({ onProceed }: { onProceed: () => void }) {
  const { items, totalAmount, updateQuantity, removeItem, loading } = useCart();

  if (loading) {
    return <p className="py-16 text-center text-sm text-gray-500">Loading your cart…</p>;
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed border-gray-300 py-20 text-center">
        <ShoppingBag className="h-12 w-12 text-gray-300" />
        <p className="text-gray-600">Your cart is empty</p>
        <Button asChild className="bg-black hover:bg-red-600">
          <Link href="/shop">Shop Now</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <ul className="divide-y divide-gray-100 rounded-lg border border-gray-200 bg-white">
          {items.map((item) => (
            <li key={item.key} className="flex gap-4 p-4">
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md border border-gray-100 bg-gray-50">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="96px"
                    className="object-contain p-1"
                  />
                ) : null}
              </div>

              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-[#0F172A]">{item.name}</p>
                    {item.size && (
                      <p className="mt-0.5 text-sm text-gray-500">Size: {item.size}</p>
                    )}
                  </div>
                  <button
                    type="button"
                    aria-label={`Remove ${item.name}`}
                    onClick={() => removeItem(item)}
                    className="rounded-md p-1.5 text-gray-400 transition-colors hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center rounded-md border border-gray-200">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={() => updateQuantity(item, item.quantity - 1)}
                      className="px-2 py-1.5 text-gray-600 hover:text-black"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      onClick={() => updateQuantity(item, item.quantity + 1)}
                      className="px-2 py-1.5 text-gray-600 hover:text-black"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="font-semibold text-[#0F172A]">
                    {formatZAR(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <Link
          href="/shop"
          className="mt-4 inline-block text-sm text-gray-600 transition-colors hover:text-black"
        >
          ← Continue Shopping
        </Link>
      </div>

      <div className="lg:col-span-1">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-base font-semibold text-[#0F172A]">Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>{formatZAR(totalAmount)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span className="text-gray-400">Calculated at next step</span>
            </div>
            <div className="flex justify-between border-t border-gray-100 pt-2 text-base font-semibold text-[#0F172A]">
              <span>Total</span>
              <span>{formatZAR(totalAmount)}</span>
            </div>
          </div>
          <Button
            onClick={onProceed}
            className="mt-6 w-full bg-black hover:bg-red-600"
          >
            Proceed to Shipping
          </Button>
        </div>
      </div>
    </div>
  );
}
