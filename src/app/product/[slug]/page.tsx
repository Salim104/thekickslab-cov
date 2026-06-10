import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchQuery } from "convex/nextjs";

import { api } from "../../../../convex/_generated/api";
import ProductCard from "@/components/ProductCard";
import ProductDetailClient from "@/components/ProductDetailClient";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await fetchQuery(api.products.getBySlug, { slug });
  if (!product) notFound();

  const related = await fetchQuery(api.products.getRelated, {
    brand: product.brand,
    category: product.category,
    excludeSlug: product.slug,
  });

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 md:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-gray-500">
        <Link href="/" className="hover:text-black">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/shop" className="hover:text-black">
          All
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <ProductDetailClient product={product} />

      {/* Related products */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-8 text-2xl font-bold">Related products</h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
