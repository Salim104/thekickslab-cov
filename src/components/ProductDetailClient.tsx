"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Heart, Minus, Plus } from "lucide-react";

import { formatZAR } from "@/lib/utils";
import { useCart } from "@/lib/useCart";
import { useWishlist } from "@/lib/useWishlist";
import { useUIStore } from "@/lib/uiStore";
import { Button } from "@/components/ui/button";
import type { Doc } from "../../convex/_generated/dataModel";

// The detail gallery always shows 4 thumbnails — if Convex only has one image
// (the current seed), repeat it to fill the row until real multi-image exists.
function buildGallery(images: string[]) {
  const valid = images.filter(Boolean);
  if (valid.length === 0) return [];
  if (valid.length >= 4) return valid.slice(0, 4);
  return Array.from({ length: 4 }, (_, i) => valid[i % valid.length]);
}

export default function ProductDetailClient({
  product,
}: {
  product: Doc<"products">;
}) {
  const gallery = buildGallery(product.images);
  const [mainIndex, setMainIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState<"description" | "reviews">("description");

  const { addItem: addToCart } = useCart();
  const openCart = useUIStore((s) => s.openCart);

  const { toggleItem: toggleWishlist, isInWishlist } = useWishlist();
  const wishlisted = isInWishlist(product._id);

  const image = gallery[mainIndex] ?? "";

  const prev = () =>
    setMainIndex((i) => (i - 1 + gallery.length) % gallery.length);
  const next = () => setMainIndex((i) => (i + 1) % gallery.length);

  const handleAddToCart = () => {
    addToCart(
      {
        id: product._id,
        slug: product.slug,
        name: product.name,
        image: gallery[0] ?? "",
        size: "",
        price: product.price,
      },
      quantity
    );
    openCart();
  };

  const handleToggleWishlist = () => {
    toggleWishlist({
      id: product._id,
      slug: product.slug,
      name: product.name,
      image: gallery[0] ?? "",
      price: product.price,
    });
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Left — gallery */}
        <div>
          <div className="relative flex h-[26rem] items-center justify-center overflow-hidden bg-white">
            {image && (
              <Image
                src={image}
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
                className="object-contain p-6"
              />
            )}
            {gallery.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Previous image"
                  onClick={prev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-gray-800 shadow transition-colors hover:bg-white"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  aria-label="Next image"
                  onClick={next}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 text-gray-800 shadow transition-colors hover:bg-white"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          <div className="mt-4 flex gap-3">
            {gallery.map((thumb, i) => (
              <button
                key={i}
                type="button"
                aria-label={`View image ${i + 1}`}
                onClick={() => setMainIndex(i)}
                className={`relative h-20 w-20 shrink-0 overflow-hidden border-2 bg-white ${
                  i === mainIndex ? "border-black" : "border-transparent"
                }`}
              >
                <Image
                  src={thumb}
                  alt={`${product.name} thumbnail ${i + 1}`}
                  fill
                  sizes="80px"
                  className="object-contain p-1"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right — info */}
        <div>
          <h1 className="text-2xl font-bold">{product.name}</h1>

          <div className="mt-4 flex items-center gap-3">
            <span className="text-2xl font-bold">{formatZAR(product.price)}</span>
            {product.originalPrice > product.price && (
              <span className="text-gray-500 line-through">
                {formatZAR(product.originalPrice)}
              </span>
            )}
            {product.discountPercent > 0 && (
              <span className="bg-red-600 px-2 py-1 text-xs font-bold text-white">
                -{product.discountPercent}%
              </span>
            )}
          </div>

          {/* Quantity selector */}
          <div className="mt-6 flex items-center gap-3">
            <span className="text-sm font-medium">Quantity</span>
            <div className="flex items-center border border-gray-300">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-2 text-gray-700 transition-colors hover:bg-gray-100"
              >
                <Minus className="h-4 w-4" />
              </button>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, Number(e.target.value) || 1))
                }
                className="w-14 border-x border-gray-300 py-2 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQuantity((q) => q + 1)}
                className="px-3 py-2 text-gray-700 transition-colors hover:bg-gray-100"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 space-y-3">
            <Button
              onClick={handleAddToCart}
              className="w-full bg-black py-6 text-base text-white hover:bg-gray-800"
            >
              ADD TO CART
            </Button>
            <Button
              variant="outline"
              onClick={handleToggleWishlist}
              className="w-full py-6 text-base"
            >
              <Heart
                className={`mr-2 h-4 w-4 text-red-600 ${
                  wishlisted ? "fill-red-600" : ""
                }`}
              />
              {wishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
            </Button>
            <Button asChild variant="outline" className="w-full py-6 text-base">
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </div>

          <p className="mt-6 text-sm text-gray-600">
            Categories: {product.category}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-16">
        <div className="flex gap-8 border-b border-gray-200">
          <button
            type="button"
            onClick={() => setTab("description")}
            className={`-mb-px pb-3 text-sm font-medium ${
              tab === "description"
                ? "border-b-2 border-black text-black"
                : "text-gray-500"
            }`}
          >
            Description
          </button>
          <button
            type="button"
            onClick={() => setTab("reviews")}
            className={`-mb-px pb-3 text-sm font-medium ${
              tab === "reviews"
                ? "border-b-2 border-black text-black"
                : "text-gray-500"
            }`}
          >
            Reviews (0)
          </button>
        </div>

        <div className="py-6 text-sm leading-relaxed text-gray-700">
          {tab === "description" ? (
            <div className="space-y-4">
              <p>
                The {product.name} from {product.brand} blends iconic style with
                everyday comfort. Crafted for sneaker lovers who refuse to
                compromise, every pair is authenticated and ready to elevate your
                rotation.
              </p>
              <p>
                Whether you&apos;re dressing up or keeping it casual, the{" "}
                {product.name} delivers standout looks and lasting quality.
                Shipped fresh across South Africa by The Kicks Lab.
              </p>
            </div>
          ) : (
            <p>There are no reviews yet.</p>
          )}
        </div>
      </div>
    </>
  );
}
