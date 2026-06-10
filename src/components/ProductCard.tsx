import Link from "next/link";
import Image from "next/image";

import { formatZAR } from "@/lib/utils";
import type { Doc } from "../../convex/_generated/dataModel";

export default function ProductCard({ product }: { product: Doc<"products"> }) {
  const image = product.images?.[0] ?? "";

  return (
    <Link href={`/product/${product.slug}`} className="group relative block">
      {/* Discount badge */}
      {product.discountPercent > 0 && (
        <span className="absolute left-2 top-2 z-10 bg-red-600 px-2 py-1 text-xs font-bold text-white">
          -{product.discountPercent}%
        </span>
      )}

      {/* Image */}
      <div className="relative mb-3 flex h-60 items-center justify-center overflow-hidden bg-white">
        <Image
          src={image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Info */}
      <div className="text-center">
        <h3 className="mb-2 text-sm uppercase text-gray-700">{product.name}</h3>
        <div className="flex items-center justify-center gap-2">
          <span className="font-bold text-red-600">{formatZAR(product.price)}</span>
          {product.originalPrice > product.price && (
            <span className="text-sm text-gray-400 line-through">
              {formatZAR(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
