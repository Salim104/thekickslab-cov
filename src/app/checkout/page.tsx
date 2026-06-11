"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useCart } from "@/lib/useCart";
import { createPaymentIntent } from "@/app/actions/createPaymentIntent";
import type { ShippingValues } from "@/lib/shippingSchema";
import StepIndicator, { type CheckoutStep } from "@/components/checkout/StepIndicator";
import CartReview from "@/components/checkout/CartReview";
import ShippingForm from "@/components/checkout/ShippingForm";
import PaymentForm from "@/components/checkout/PaymentForm";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalAmount, clear } = useCart();

  const [step, setStep] = useState<CheckoutStep>(1);
  const [shipping, setShipping] = useState<ShippingValues | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  // Step 2 → 3: create the pending order + Stripe PaymentIntent, then advance.
  async function handleShippingSubmit(values: ShippingValues) {
    if (items.length === 0) {
      toast.error("Your cart is empty.");
      setStep(1);
      return;
    }
    setShipping(values);
    setCreating(true);
    try {
      const result = await createPaymentIntent(
        items.map((i) => ({
          productId: i.productId,
          size: i.size,
          quantity: i.quantity,
        })),
        values
      );
      if (!result.success || !result.clientSecret || !result.orderNumber) {
        toast.error(result.error ?? "Could not start payment. Please try again.");
        return;
      }
      setClientSecret(result.clientSecret);
      setOrderNumber(result.orderNumber);
      setStep(3);
    } finally {
      setCreating(false);
    }
  }

  function handlePaid() {
    const order = orderNumber;
    clear();
    router.push(`/checkout/success?order=${order ?? ""}`);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="mb-8 text-center text-3xl font-bold text-[#0F172A]">Checkout</h1>

      <StepIndicator current={step} />

      {step === 1 && <CartReview onProceed={() => setStep(2)} />}

      {step === 2 && (
        <ShippingForm
          items={items}
          subtotal={totalAmount}
          total={totalAmount}
          defaultValues={shipping}
          submitting={creating}
          onBack={() => setStep(1)}
          onSubmit={handleShippingSubmit}
        />
      )}

      {step === 3 && clientSecret && orderNumber && (
        <PaymentForm
          clientSecret={clientSecret}
          orderNumber={orderNumber}
          items={items}
          subtotal={totalAmount}
          total={totalAmount}
          onBack={() => setStep(2)}
          onPaid={handlePaid}
        />
      )}
    </div>
  );
}
