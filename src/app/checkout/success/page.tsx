import Link from "next/link";
import Image from "next/image";
import { fetchQuery } from "convex/nextjs";
import { CheckCircle2 } from "lucide-react";

import { api } from "../../../../convex/_generated/api";
import { formatZAR } from "@/lib/utils";

export const metadata = { title: "Order Confirmed — The Kicks Lab" };

// Server-rendered confirmation. The order is created (status `pending`) by the
// payment action before payment and flipped to `paid` by the webhook, so it
// always exists here by order number.
export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;
  const orderDoc = order
    ? await fetchQuery(api.orders.getByOrderNumber, { orderNumber: order })
    : null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
      <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-green-500" />
      <h1 className="mb-2 text-3xl font-bold text-[#0F172A]">Order Confirmed! 🎉</h1>
      <p className="mb-8 text-gray-600">
        Thank you for your purchase. A confirmation email is on its way.
      </p>

      {orderDoc ? (
        <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 text-left">
          <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-4">
            <span className="text-sm text-gray-500">Order number</span>
            <span className="font-mono font-semibold text-red-600">
              {orderDoc.orderNumber}
            </span>
          </div>

          <ul className="mb-4 space-y-3">
            {orderDoc.items.map((item, i) => (
              <li key={i} className="flex items-center gap-3">
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
                  <p className="truncate text-sm font-medium text-[#0F172A]">
                    {item.name}
                  </p>
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

          <div className="flex justify-between border-t border-gray-100 pt-4 text-base font-semibold text-[#0F172A]">
            <span>Total Paid</span>
            <span>{formatZAR(orderDoc.total)}</span>
          </div>

          <div className="mt-4 border-t border-gray-100 pt-4 text-sm text-gray-600">
            <p className="mb-1 font-medium text-[#0F172A]">Shipping to</p>
            <p>
              {orderDoc.shipping.firstName} {orderDoc.shipping.lastName}
            </p>
            <p>{orderDoc.shipping.address1}</p>
            {orderDoc.shipping.address2 && <p>{orderDoc.shipping.address2}</p>}
            <p>
              {orderDoc.shipping.city}, {orderDoc.shipping.province}{" "}
              {orderDoc.shipping.postalCode}
            </p>
          </div>
        </div>
      ) : (
        <p className="mb-8 text-sm text-gray-500">
          Your order has been received. Check your email for the confirmation details.
        </p>
      )}

      <div className="flex flex-col justify-center gap-3 sm:flex-row">
        <Link
          href="/shop"
          className="rounded-md bg-black px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-600"
        >
          Continue Shopping
        </Link>
        <Link
          href="/account"
          className="rounded-md border border-gray-300 px-6 py-2.5 text-sm font-medium text-[#0F172A] transition-colors hover:border-black"
        >
          View My Orders
        </Link>
      </div>
    </div>
  );
}
