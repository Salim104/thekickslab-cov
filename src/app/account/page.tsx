import { currentUser } from "@clerk/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../convex/_generated/api";
import AccountTabs from "@/components/account/AccountTabs";

export default async function AccountPage() {
  const user = await currentUser();

  // The layout guard guarantees a session; this satisfies the type narrowing.
  if (!user) return null;

  // Convex user is created by the Clerk webhook. It may not exist yet in local
  // dev (no webhook tunnel) — the UI degrades gracefully when null.
  const convexUser = await fetchQuery(api.users.getByClerkId, {
    clerkId: user.id,
  });

  const memberSince = convexUser
    ? new Date(convexUser._creationTime).toLocaleDateString("en-ZA", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <>
      <h1 className="mb-8 text-3xl font-bold">My Account</h1>
      <AccountTabs
        name={user.fullName ?? "Customer"}
        email={user.primaryEmailAddress?.emailAddress ?? ""}
        imageUrl={user.imageUrl}
        memberSince={memberSince}
        convexUserId={convexUser?._id ?? null}
      />
    </>
  );
}
