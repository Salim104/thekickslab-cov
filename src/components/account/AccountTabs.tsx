"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Id } from "../../../convex/_generated/dataModel";
import AccountWishlist from "./AccountWishlist";

type Tab = "profile" | "wishlist" | "orders";

const TABS: { id: Tab; label: string }[] = [
  { id: "profile", label: "Profile" },
  { id: "wishlist", label: "Wishlist" },
  { id: "orders", label: "Orders" },
];

export default function AccountTabs({
  name,
  email,
  imageUrl,
  memberSince,
  convexUserId,
}: {
  name: string;
  email: string;
  imageUrl: string;
  memberSince: string | null;
  convexUserId: Id<"users"> | null;
}) {
  const [tab, setTab] = useState<Tab>("profile");

  return (
    <div>
      {/* Tab bar */}
      <div className="mb-8 flex gap-6 border-b border-gray-200">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "-mb-px border-b-2 px-1 pb-3 text-sm font-medium transition-colors",
              tab === t.id
                ? "border-black text-black"
                : "border-transparent text-gray-500 hover:text-black"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "profile" && (
        <div className="flex flex-col items-center gap-4 rounded-lg border border-gray-200 bg-white p-8 sm:flex-row sm:items-center sm:gap-6">
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full bg-gray-100">
            {imageUrl && (
              <Image
                src={imageUrl}
                alt={name}
                fill
                sizes="96px"
                className="object-cover"
              />
            )}
          </div>
          <dl className="space-y-3 text-center sm:text-left">
            <div>
              <dt className="text-xs uppercase tracking-wide text-gray-400">Name</dt>
              <dd className="text-lg font-semibold">{name}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-gray-400">Email</dt>
              <dd className="text-gray-700">{email || "—"}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-gray-400">
                Member since
              </dt>
              <dd className="text-gray-700">{memberSince ?? "—"}</dd>
            </div>
          </dl>
        </div>
      )}

      {tab === "wishlist" && <AccountWishlist convexUserId={convexUserId} />}

      {tab === "orders" && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 py-16 text-center">
          <p className="mb-4 text-gray-600">
            Your orders will appear here once you make a purchase.
          </p>
          <Link
            href="/shop"
            className="rounded-md bg-black px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600"
          >
            Shop Now
          </Link>
        </div>
      )}
    </div>
  );
}
