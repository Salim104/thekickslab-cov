import { notFound } from "next/navigation";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../../../convex/_generated/api";
import AdminHeader from "@/components/admin/AdminHeader";
import ProductForm from "@/components/admin/ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await fetchQuery(api.products.getBySlug, { slug });

  if (!product) notFound();

  return (
    <>
      <AdminHeader title="Edit Product" />
      <div className="flex-1 p-8">
        <ProductForm product={product} />
      </div>
    </>
  );
}
