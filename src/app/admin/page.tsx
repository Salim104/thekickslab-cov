import { redirect } from "next/navigation";

// /admin → products is the default admin landing page.
export default function AdminIndexPage() {
  redirect("/admin/products");
}
