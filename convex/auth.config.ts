// Registers Clerk as Convex's auth provider so `ctx.auth.getUserIdentity()`
// can validate the Clerk JWT the browser sends (via ConvexProviderWithClerk).
//
// Setup (one-time, required for the auth checks in mutations to work):
//   1. In the Clerk dashboard create a JWT template named "convex"
//      (audience "convex" — Clerk's default for this template).
//   2. Set the issuer domain in Convex env (NOT .env.local):
//        npx convex env set CLERK_JWT_ISSUER_DOMAIN https://<your-app>.clerk.accounts.dev
//      (the issuer is the "Issuer" URL shown on that JWT template.)
//   3. Push: npx convex dev  (or `npx convex dev --once`).
//
// applicationID must equal the JWT's "aud" claim ("convex").
export default {
  providers: [
    {
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN,
      applicationID: "convex",
    },
  ],
};
