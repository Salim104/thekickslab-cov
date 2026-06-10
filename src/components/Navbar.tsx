"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Heart, ShoppingBag, User, Menu, X } from "lucide-react";
import { UserButton, useUser } from "@clerk/nextjs";

import { cn } from "@/lib/utils";
import { useCart } from "@/lib/useCart";
import { useWishlist } from "@/lib/useWishlist";
import { useUIStore } from "@/lib/uiStore";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Contact", href: "/contact" },
];

function Badge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-semibold leading-none text-white">
      {count > 99 ? "99+" : count}
    </span>
  );
}

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const cartCount = useCart().totalItems;
  const wishlistCount = useWishlist().totalItems;
  const openCart = useUIStore((s) => s.openCart);
  const openWishlist = useUIStore((s) => s.openWishlist);
  const { isLoaded, isSignedIn } = useUser();

  // Avoid hydration mismatch: persisted counts only render after mount.
  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200 bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center">
          <Image
            src="/assets/main-logo.png"
            alt="The Kicks Lab"
            width={120}
            height={32}
            className="h-8 w-auto"
            priority
          />
        </Link>

        {/* Desktop nav links */}
        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-neutral-800 transition-colors hover:text-red-600"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Icons */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            aria-label="Search"
            className="rounded-md p-2 text-neutral-800 transition-colors hover:text-red-600"
          >
            <Search className="h-5 w-5" />
          </button>

          <button
            type="button"
            aria-label="Open wishlist"
            onClick={openWishlist}
            className="relative rounded-md p-2 text-neutral-800 transition-colors hover:text-red-600"
          >
            <Heart className="h-5 w-5" />
            {mounted && <Badge count={wishlistCount} />}
          </button>

          <button
            type="button"
            aria-label="Open cart"
            onClick={openCart}
            className="relative rounded-md p-2 text-neutral-800 transition-colors hover:text-red-600"
          >
            <ShoppingBag className="h-5 w-5" />
            {mounted && <Badge count={cartCount} />}
          </button>

          {/* Profile — logged out links to sign-in, logged in shows Clerk UserButton.
              Until Clerk loads, show a non-interactive placeholder to avoid a flash. */}
          {!isLoaded ? (
            <span className="p-2 text-neutral-300" aria-hidden>
              <User className="h-5 w-5" />
            </span>
          ) : isSignedIn ? (
            <div className="flex items-center px-1">
              {/* afterSignOutUrl is set globally on <ClerkProvider> in layout.tsx */}
              <UserButton userProfileMode="navigation" userProfileUrl="/account" />
            </div>
          ) : (
            <Link
              href="/sign-in"
              aria-label="Sign in"
              className="rounded-md p-2 text-neutral-800 transition-colors hover:text-red-600"
            >
              <User className="h-5 w-5" />
            </Link>
          )}

          {/* Mobile hamburger */}
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((o) => !o)}
            className="rounded-md p-2 text-neutral-800 transition-colors hover:text-red-600 md:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      <div
        className={cn(
          "overflow-hidden border-t border-neutral-200 md:hidden",
          mobileOpen ? "block" : "hidden"
        )}
      >
        <div className="flex flex-col px-6 py-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="py-2 text-sm font-medium text-neutral-800 transition-colors hover:text-red-600"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
