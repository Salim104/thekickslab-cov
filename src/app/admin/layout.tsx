import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../convex/_generated/api";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata: Metadata = {
  title: "Admin — The Kicks Lab",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Auth gate (Clerk now wired). The proxy redirects unauthenticated users to
  // /sign-in; here we additionally require the "admin" role from the Convex
  // `users` record. Non-admins are bounced to the storefront.
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await fetchQuery(api.users.getByClerkId, { clerkId: userId });
  if (!user || user.role !== "admin") redirect("/");

  // NOTE: the admin Convex mutations (products.create/update/remove,
  // users.updateRole) are still not auth-checked at the Convex layer. This
  // layout + proxy gate the UI, but hardening those mutations needs identity in
  // Convex (ConvexProviderWithClerk + a Clerk JWT template + ctx.auth checks) —
  // a follow-up beyond this feature's scope.

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
