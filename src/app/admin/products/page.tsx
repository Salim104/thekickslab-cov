import AdminHeader from "@/components/admin/AdminHeader";
import ProductsTable from "@/components/admin/ProductsTable";

export default function AdminProductsPage() {
  return (
    <>
      <AdminHeader title="Products" actionLabel="Add Product" actionHref="/admin/products/new" />
      <div className="flex-1 p-8">
        <ProductsTable />
      </div>
    </>
  );
}
