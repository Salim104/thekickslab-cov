import type { NextRequest } from "next/server";
import { createElement } from "react";
import { Resend } from "resend";
import { fetchMutation } from "convex/nextjs";

import { api } from "../../../../../convex/_generated/api";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import OrderConfirmationEmail, {
  type OrderEmailProps,
} from "@/emails/OrderConfirmationEmail";
import AdminOrderEmail from "@/emails/AdminOrderEmail";

// Stripe → app order fulfilment. Stripe POSTs payment events here; the signature
// is verified with STRIPE_WEBHOOK_SECRET against the RAW request body. On
// payment_intent.succeeded we flip the matching order to `paid` and send the
// customer + admin confirmation emails.
//
// Local dev needs the Stripe CLI to forward events and supply the secret:
//   stripe listen --forward-to localhost:3000/api/stripe/webhook
//   (copy the printed whsec_... into STRIPE_WEBHOOK_SECRET in .env.local)
// Production: add the endpoint in the Stripe dashboard and set the secret in
// Vercel env.
export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret || !isStripeConfigured) {
    console.error("[stripe webhook] Stripe is not configured (secret key / webhook secret)");
    return new Response("Webhook not configured", { status: 500 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return new Response("Missing stripe-signature", { status: 400 });
  }

  const rawBody = await req.text();

  let event;
  try {
    event = getStripe().webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("[stripe webhook] signature verification failed:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  if (event.type === "payment_intent.succeeded") {
    const intent = event.data.object;
    const orderNumber = intent.metadata?.orderNumber;

    if (!orderNumber) {
      console.error("[stripe webhook] payment intent missing orderNumber metadata");
      return new Response("ok", { status: 200 });
    }

    try {
      const { order, justPaid } = await fetchMutation(api.orders.markPaid, {
        orderNumber,
        stripePaymentIntentId: intent.id,
      });

      // Send emails only on the first pending→paid transition (idempotent across
      // Stripe retries).
      if (order && justPaid) {
        await sendOrderEmails({
          orderNumber: order.orderNumber,
          items: order.items,
          shipping: order.shipping,
          subtotal: order.subtotal,
          total: order.total,
        });
      }
    } catch (err) {
      // Returning 500 makes Stripe retry, which is what we want on a transient
      // failure (the markPaid idempotency guard prevents double emails).
      console.error("[stripe webhook] fulfilment failed:", err);
      return new Response("Fulfilment error", { status: 500 });
    }
  }

  return new Response("ok", { status: 200 });
}

// Sends the customer confirmation + admin notification. Failures are logged but
// don't fail the webhook — the order is already paid and recorded.
async function sendOrderEmails(data: OrderEmailProps) {
  const apiKey = process.env.RESEND_API_KEY;
  const adminTo = process.env.RESEND_TO_EMAIL;
  if (!apiKey) {
    console.error("[stripe webhook] RESEND_API_KEY not set — skipping emails");
    return;
  }

  const resend = new Resend(apiKey);

  try {
    await resend.emails.send({
      from: "The Kicks Lab <onboarding@resend.dev>",
      to: data.shipping.email,
      subject: `Order Confirmed — ${data.orderNumber}`,
      react: createElement(OrderConfirmationEmail, data),
    });
  } catch (err) {
    console.error("[stripe webhook] customer email failed:", err);
  }

  if (adminTo) {
    try {
      await resend.emails.send({
        from: "The Kicks Lab <onboarding@resend.dev>",
        to: adminTo,
        subject: `New Order — ${data.orderNumber}`,
        react: createElement(AdminOrderEmail, data),
      });
    } catch (err) {
      console.error("[stripe webhook] admin email failed:", err);
    }
  }
}
