import type { NextRequest } from "next/server";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { fetchMutation } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";

// Clerk → Convex user sync. Configured in the Clerk dashboard to POST `user.*`
// events here. Signature is verified with Svix (via Clerk's verifyWebhook) using
// CLERK_WEBHOOK_SECRET. On `user.created` we create the Convex `users` row.
//
// Dashboard setup:
//   - Prod endpoint:  https://thekickslab.vercel.app/api/clerk-webhook
//   - Local dev:      expose localhost with ngrok/cloudflared, point the Clerk
//                     webhook at the tunnel URL.
//   - Secret:         npx convex env set CLERK_WEBHOOK_SECRET whsec_...
//                     and add CLERK_WEBHOOK_SECRET to .env.local / Vercel env.
export async function POST(req: NextRequest) {
  const signingSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!signingSecret) {
    // Misconfiguration, not a bad request — surface it clearly in logs.
    console.error("CLERK_WEBHOOK_SECRET is not set");
    return new Response("Webhook secret not configured", { status: 500 });
  }

  let evt;
  try {
    evt = await verifyWebhook(req, { signingSecret });
  } catch (err) {
    console.error("Clerk webhook verification failed:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  if (evt.type === "user.created") {
    const { id, email_addresses, primary_email_address_id, first_name, last_name, username } =
      evt.data;

    const primaryEmail =
      email_addresses.find((e) => e.id === primary_email_address_id)?.email_address ??
      email_addresses[0]?.email_address ??
      "";

    const name =
      [first_name, last_name].filter(Boolean).join(" ").trim() ||
      username ||
      primaryEmail ||
      "Customer";

    await fetchMutation(api.users.createFromClerk, {
      clerkId: id,
      email: primaryEmail,
      name,
    });
  }

  // Acknowledge all other events so Clerk doesn't retry them.
  return new Response("ok", { status: 200 });
}
