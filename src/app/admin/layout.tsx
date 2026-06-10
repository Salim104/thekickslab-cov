import type { Metadata } from "next";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata: Metadata = {
  title: "Admin — The Kicks Lab",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // TODO(auth): gate this layout once Clerk is configured.
  //   1. `middleware.ts` with clerkMiddleware() matching /admin/* → redirect
  //      unauthenticated users to /sign-in.
  //   2. Here (or a server util): read the Clerk userId, look up the Convex
  //      `users` record by clerkId, and redirect("/") if role !== "admin".
  // Skipped for now: no Clerk keys in env, and wiring Clerk globally would
  // break the public site. CRUD below works without it.

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
