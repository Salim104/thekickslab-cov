"use client";

import Link from "next/link";
import { useQuery } from "convex/react";

import { api } from "../../convex/_generated/api";
import ProductCard from "@/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";

function CardSkeleton() {
  return (
    <div className="flex flex-col">
      <Skeleton className="mb-3 h-60 w-full" />
      <Skeleton className="mx-auto mb-2 h-4 w-3/4" />
      <Skeleton className="mx-auto h-4 w-1/3" />
    </div>
  );
}

export default function BestSelling() {
  const products = useQuery(api.products.getBestSellers);
  const loading = products === undefined;

  return (
    <section className="bg-white py-10">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <h2 className="mb-8 text-3xl font-bold">BEST SELLING</h2>

        {loading ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-12 text-center">
            <p className="text-gray-600">No best sellers yet — check back soon.</p>
            <Link
              href="/shop"
              className="rounded-md bg-black px-6 py-2.5 font-medium text-white transition-colors hover:bg-gray-800"
            >
              Shop All
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
