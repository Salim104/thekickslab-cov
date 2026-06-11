"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Package, ShoppingCart, Users, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Users", href: "/admin/users", icon: Users },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-gray-200 bg-[#0F172A] text-white">
      <div className="flex items-center gap-2 border-b border-white/10 px-6 py-5">
        <Image
          src="/assets/main-logo.png"
          alt="The Kicks Lab"
          width={120}
          height={32}
          className="h-8 w-auto brightness-0 invert"
        />
      </div>

      <div className="flex items-center gap-2 px-6 py-4 text-xs font-semibold tracking-wider text-white/40 uppercase">
        <LayoutGrid className="h-3.5 w-3.5" />
        Admin
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3">
        {NAV.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-red-500 text-white"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/*
        TODO(auth): replace with Clerk's <SignOutButton>. No Clerk keys in env
        yet, so this is a plain link back to the storefront for now.
      */}
      <div className="border-t border-white/10 p-3">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </Link>
      </div>
    </aside>
  );
}
