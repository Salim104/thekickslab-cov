"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id, Doc } from "../../../convex/_generated/dataModel";
import { formatZAR } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

type OrderStatus = Doc<"orders">["status"];

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "bg-gray-100 text-gray-700",
  paid: "bg-green-100 text-green-700",
  shipped: "bg-blue-100 text-blue-700",
  delivered: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function AccountOrders({
  convexUserId,
}: {
  convexUserId: Id<"users"> | null;
}) {
  const orders = useQuery(
    api.orders.getByUser,
    convexUserId ? { userId: convexUserId } : "skip"
  );

  // No Convex user yet (e.g. webhook hasn't synced) — nothing to show.
  if (!convexUserId) return <EmptyState />;

  if (orders === undefined) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (orders.length === 0) return <EmptyState />;

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const count = order.items.reduce((s, i) => s + i.quantity, 0);
        return (
          <div
            key={order._id}
            className="rounded-lg border border-gray-200 bg-white p-5"
          >
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
              <div>
                <p className="font-mono text-sm font-semibold text-[#0F172A]">
                  {order.orderNumber}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString("en-ZA", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <Badge className={STATUS_STYLES[order.status]}>{order.status}</Badge>
            </div>

            <ul className="space-y-1 text-sm text-gray-600">
              {order.items.map((item, i) => (
                <li key={i} className="flex justify-between">
                  <span className="truncate pr-2">
                    {item.name}
                    {item.size ? ` · Size ${item.size}` : ""} × {item.quantity}
                  </span>
                  <span className="shrink-0">{formatZAR(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>

            <div className="mt-3 flex justify-between border-t border-gray-100 pt-3 text-sm font-semibold text-[#0F172A]">
              <span>
                Total · {count} {count === 1 ? "item" : "items"}
              </span>
              <span>{formatZAR(order.total)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 py-16 text-center">
      <p className="mb-4 text-gray-600">
        Your orders will appear here once you make a purchase.
      </p>
      <Link
        href="/shop"
        className="rounded-md bg-black px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600"
      >
        Shop Now
      </Link>
    </div>
  );
}
