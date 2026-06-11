"use server";

import { auth } from "@clerk/nextjs/server";
import { fetchMutation, fetchQuery } from "convex/nextjs";

import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { getStripe, isStripeConfigured, toStripeAmount } from "@/lib/stripe";
import { shippingSchema, type ShippingValues } from "@/lib/shippingSchema";

export type CheckoutItem = {
  productId: string;
  size: string;
  quantity: number;
};

export type CreatePaymentIntentResult = {
  success: boolean;
  clientSecret?: string;
  orderNumber?: string;
  error?: string;
};

// Creates a pending Convex order (authoritative pricing happens in the mutation)
// and a Stripe PaymentIntent in ZAR. Returns the client secret for Stripe
// Elements plus the order number for the success redirect. The webhook flips the
// order to `paid` on payment_intent.succeeded — money is never trusted from here.
export async function createPaymentIntent(
  items: CheckoutItem[],
  shipping: ShippingValues
): Promise<CreatePaymentIntentResult> {
  if (!isStripeConfigured) {
    console.error("[createPaymentIntent] STRIPE_SECRET_KEY is not set");
    return { success: false, error: "Payments are not configured yet." };
  }

  if (!items || items.length === 0) {
    return { success: false, error: "Your cart is empty." };
  }

  // Re-validate shipping server-side — the action is reachable via direct POST.
  const parsedShipping = shippingSchema.safeParse(shipping);
  if (!parsedShipping.success) {
    return { success: false, error: "Please complete the shipping details." };
  }

  // Resolve the Convex user from the Clerk session (server-trusted). Guests and
  // not-yet-synced users get an order with no userId.
  let userId: Id<"users"> | undefined;
  try {
    const { userId: clerkId } = await auth();
    if (clerkId) {
      const convexUser = await fetchQuery(api.users.getByClerkId, { clerkId });
      userId = convexUser?._id;
    }
  } catch (err) {
    // Auth lookup failing shouldn't block a guest checkout.
    console.error("[createPaymentIntent] user lookup failed:", err);
  }

  try {
    const { orderNumber, total } = await fetchMutation(api.orders.create, {
      userId,
      items: items.map((i) => ({
        productId: i.productId as Id<"products">,
        size: i.size,
        quantity: i.quantity,
      })),
      shipping: parsedShipping.data,
    });

    const intent = await getStripe().paymentIntents.create({
      amount: toStripeAmount(total),
      currency: "zar",
      metadata: { orderNumber },
      automatic_payment_methods: { enabled: true },
    });

    if (!intent.client_secret) {
      return { success: false, error: "Could not start payment. Please try again." };
    }

    return { success: true, clientSecret: intent.client_secret, orderNumber };
  } catch (err) {
    console.error("[createPaymentIntent] error:", err);
    return { success: false, error: "Could not start payment. Please try again." };
  }
}
