"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";

import { formatZAR } from "@/lib/utils";
import { useWishlistStore } from "@/lib/wishlistStore";
import { useCartStore } from "@/lib/cartStore";
import { useUIStore } from "@/lib/uiStore";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export default function WishlistDrawer() {
  const open = useUIStore((s) => s.wishlistOpen);
  const setOpen = useUIStore((s) => s.setWishlistOpen);

  const items = useWishlistStore((s) => s.items);
  const totalItems = useWishlistStore((s) => s.totalItems);
  const removeItem = useWishlistStore((s) => s.removeItem);
  const addToCart = useCartStore((s) => s.addItem);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="flex w-full flex-col bg-white p-0 sm:max-w-md">
        <SheetHeader className="border-b border-neutral-200">
          <SheetTitle className="text-base">
            Your Wishlist ({totalItems})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <Heart className="h-12 w-12 text-neutral-300" />
            <p className="text-sm text-neutral-500">Your wishlist is empty</p>
            <Button asChild variant="outline" onClick={() => setOpen(false)}>
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-4">
            <ul className="divide-y divide-neutral-100">
              {items.map((item) => (
                <li key={item.id} className="flex gap-3 py-4">
                  <Link
                    href={`/product/${item.slug}`}
                    onClick={() => setOpen(false)}
                    className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-neutral-50"
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="h-full w-full object-contain"
                    />
                  </Link>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <Link
                        href={`/product/${item.slug}`}
                        onClick={() => setOpen(false)}
                        className="line-clamp-2 text-sm font-medium text-neutral-900 transition-colors hover:text-red-600"
                      >
                        {item.name}
                      </Link>
                      <p className="mt-0.5 text-sm text-neutral-700">
                        {formatZAR(item.price)}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <Button
                        size="sm"
                        className="bg-neutral-900 text-white hover:bg-neutral-800"
                        onClick={() =>
                          addToCart({
                            id: item.id,
                            slug: item.slug,
                            name: item.name,
                            image: item.image,
                            size: "",
                            price: item.price,
                          })
                        }
                      >
                        Add to Cart
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeItem(item.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
