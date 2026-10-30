import { requireAdmin } from "@/lib/admin";
import { CategoryFormClient } from "@/components/admin/CategoryFormClient";

export default async function NewCategoryPage() {
  await requireAdmin();
  return <CategoryFormClient />;
}
