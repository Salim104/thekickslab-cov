import AdminHeader from "@/components/admin/AdminHeader";
import ProductForm from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <>
      <AdminHeader title="Add Product" />
      <div className="flex-1 p-8">
        <ProductForm />
      </div>
    </>
  );
}
