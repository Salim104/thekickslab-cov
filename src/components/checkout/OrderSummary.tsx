"use client";

import Image from "next/image";
import { formatZAR } from "@/lib/utils";
import type { UnifiedCartItem } from "@/lib/useCart";

// Sidebar order summary, reused in the Shipping and Payment steps. `showShipping`
// renders the "Calculated at checkout / —" line on the payment step.
export default function OrderSummary({
  items,
  subtotal,
  total,
  showShipping = false,
}: {
  items: UnifiedCartItem[];
  subtotal: number;
  total: number;
  showShipping?: boolean;
}) {
  const count = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <h2 className="mb-4 text-base font-semibold text-[#0F172A]">
        Order Summary ({count} {count === 1 ? "item" : "items"})
      </h2>

      <ul className="mb-4 space-y-3">
        {items.map((item) => (
          <li key={item.key} className="flex items-center gap-3">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md border border-gray-100 bg-gray-50">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="56px"
                  className="object-contain p-1"
                />
              ) : null}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-[#0F172A]">{item.name}</p>
              <p className="text-xs text-gray-500">
                {item.size ? `Size ${item.size} · ` : ""}Qty {item.quantity}
              </p>
            </div>
            <span className="text-sm font-medium text-[#0F172A]">
              {formatZAR(item.price * item.quantity)}
            </span>
          </li>
        ))}
      </ul>

      <div className="space-y-2 border-t border-gray-100 pt-4 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>{formatZAR(subtotal)}</span>
        </div>
        {showShipping && (
          <div className="flex justify-between text-gray-600">
            <span>Shipping</span>
            <span className="text-gray-400">TBD</span>
          </div>
        )}
        <div className="flex justify-between border-t border-gray-100 pt-2 text-base font-semibold text-[#0F172A]">
          <span>Total</span>
          <span>{formatZAR(total)}</span>
        </div>
      </div>
    </div>
  );
}
