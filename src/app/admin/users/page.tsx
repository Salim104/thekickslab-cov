import AdminHeader from "@/components/admin/AdminHeader";
import UsersTable from "@/components/admin/UsersTable";

export default function AdminUsersPage() {
  return (
    <>
      <AdminHeader title="Users" />
      <div className="flex-1 p-8">
        <UsersTable />
      </div>
    </>
  );
}
