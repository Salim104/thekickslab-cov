import { ShoppingCart } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";

export default function AdminOrdersPage() {
  return (
    <>
      <AdminHeader title="Orders" />
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
            <ShoppingCart className="h-6 w-6 text-gray-400" />
          </div>
          <h2 className="text-lg font-semibold text-[#0F172A]">
            Orders coming in Phase 3
          </h2>
          <p className="max-w-sm text-sm text-gray-500">
            Order management arrives with Stripe payments. Once checkout is live,
            customer orders will appear here.
          </p>
        </div>
      </div>
    </>
  );
}
