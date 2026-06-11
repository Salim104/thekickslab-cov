import Stripe from "stripe";

// Server-side Stripe client. The secret key lives only in the server env
// (.env.local / Vercel), never NEXT_PUBLIC.
//
// Constructed lazily: `new Stripe("")` throws ("Neither apiKey nor
// config.authenticator provided"), which would blow up at module-import time
// during the build's page-data collection. A lazy getter keeps import side-effect
// free, so routes that import this only fail if they actually call Stripe without
// a key — and they guard on isStripeConfigured first.
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    _stripe = new Stripe(secretKey, { typescript: true });
  }
  return _stripe;
}

export const isStripeConfigured = (process.env.STRIPE_SECRET_KEY ?? "").length > 0;

// ZAR amounts in the app are in Rand (e.g. 1799.99). Stripe charges in the
// smallest unit (cents), so multiply by 100 and round.
export function toStripeAmount(rand: number): number {
  return Math.round(rand * 100);
}
