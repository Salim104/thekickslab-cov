import Link from "next/link";
import { Button } from "@/components/ui/button";

type AdminHeaderProps = {
  title: string;
  // Optional primary action rendered top-right (e.g. "Add Product").
  actionLabel?: string;
  actionHref?: string;
};

// Shared top bar for admin pages: page title left, optional primary action right.
export default function AdminHeader({ title, actionLabel, actionHref }: AdminHeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white px-8 py-5">
      <h1 className="text-2xl font-bold text-[#0F172A]">{title}</h1>
      {actionLabel && actionHref ? (
        <Button asChild className="bg-[#0F172A] hover:bg-red-500">
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      ) : null}
    </header>
  );
}
