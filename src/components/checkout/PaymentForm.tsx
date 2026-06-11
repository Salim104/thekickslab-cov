"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Loader2, Lock } from "lucide-react";

import { formatZAR } from "@/lib/utils";
import type { UnifiedCartItem } from "@/lib/useCart";
import { Button } from "@/components/ui/button";
import OrderSummary from "./OrderSummary";

// Module-level singleton — loadStripe should run once. Null when the publishable
// key isn't set (the component renders a friendly notice instead of Elements).
const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

type Props = {
  clientSecret: string;
  orderNumber: string;
  items: UnifiedCartItem[];
  subtotal: number;
  total: number;
  onBack: () => void;
  onPaid: () => void;
};

export default function PaymentForm(props: Props) {
  if (!stripePromise) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-sm text-amber-800">
        Payments aren&apos;t configured yet. Add{" "}
        <code className="font-mono">NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code> to enable
        checkout.
        <div className="mt-4">
          <Button type="button" variant="outline" onClick={props.onBack}>
            ← Back to Shipping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret: props.clientSecret,
        appearance: { theme: "stripe", variables: { colorPrimary: "#DC2626" } },
      }}
    >
      <PaymentInner {...props} />
    </Elements>
  );
}

function PaymentInner({
  orderNumber,
  items,
  subtotal,
  total,
  onBack,
  onPaid,
}: Props) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePay() {
    if (!stripe || !elements) return;
    setProcessing(true);
    setError(null);

    const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success?order=${orderNumber}`,
      },
      // Stay on the page for cards that don't need 3-D Secure; only redirect when
      // the bank requires it.
      redirect: "if_required",
    });

    if (confirmError) {
      setError(confirmError.message ?? "Payment failed. Please try again.");
      setProcessing(false);
      return;
    }

    if (paymentIntent && paymentIntent.status === "succeeded") {
      onPaid();
      return;
    }

    // Any other status (e.g. processing) — let the user know without redirecting.
    setError("Payment could not be completed. Please try again.");
    setProcessing(false);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <div className="space-y-5 rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="text-base font-semibold text-[#0F172A]">Payment details</h2>

          <PaymentElement />

          {error && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
          )}

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              disabled={processing}
            >
              ← Back to Shipping
            </Button>
            <Button
              type="button"
              onClick={handlePay}
              disabled={!stripe || processing}
              className="bg-black hover:bg-red-600 sm:min-w-48"
            >
              {processing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Lock className="mr-2 h-4 w-4" />
              )}
              {processing ? "Processing…" : `Pay ${formatZAR(total)}`}
            </Button>
          </div>
        </div>
      </div>

      <div className="lg:col-span-1">
        <OrderSummary items={items} subtotal={subtotal} total={total} showShipping />
      </div>
    </div>
  );
}
