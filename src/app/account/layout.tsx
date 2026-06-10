import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

export const metadata: Metadata = {
  title: "My Account — The Kicks Lab",
};

// Auth guard for /account/*. The proxy (src/proxy.ts) already redirects
// unauthenticated users, but this is a defence-in-depth check at the route level
// so the account UI never renders without a Clerk session.
export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  return <div className="mx-auto max-w-5xl px-6 py-10">{children}</div>;
}
