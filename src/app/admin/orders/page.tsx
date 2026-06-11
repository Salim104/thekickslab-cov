import AdminHeader from "@/components/admin/AdminHeader";
import OrdersTable from "@/components/admin/OrdersTable";

export default function AdminOrdersPage() {
  return (
    <>
      <AdminHeader title="Orders" />
      <div className="flex-1 p-8">
        <OrdersTable />
      </div>
    </>
  );
}
