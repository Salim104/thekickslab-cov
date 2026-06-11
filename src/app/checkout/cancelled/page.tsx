import Link from "next/link";
import { XCircle } from "lucide-react";

export const metadata = { title: "Payment Cancelled — The Kicks Lab" };

export default function CheckoutCancelledPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
      <XCircle className="mx-auto mb-4 h-16 w-16 text-gray-400" />
      <h1 className="mb-2 text-3xl font-bold text-[#0F172A]">Payment Cancelled</h1>
      <p className="mb-8 text-gray-600">
        Your cart has been saved — you can pick up right where you left off.
      </p>

      <div className="flex flex-col justify-center gap-3 sm:flex-row">
        <Link
          href="/checkout"
          className="rounded-md bg-black px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-600"
        >
          Try Again
        </Link>
        <Link
          href="/shop"
          className="rounded-md border border-gray-300 px-6 py-2.5 text-sm font-medium text-[#0F172A] transition-colors hover:border-black"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
