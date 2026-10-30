import { requireAdmin } from "@/lib/admin";
import { AdminCategoriesClient } from "@/components/admin/AdminCategoriesClient";

export default async function AdminCategoriesPage() {
  await requireAdmin();
  return <AdminCategoriesClient />;
}
