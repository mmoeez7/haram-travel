import { requireAdmin } from "@/lib/admin";
import { AdminReviewsClient } from "@/components/admin/AdminReviewsClient";

export default async function AdminReviewsPage() {
  await requireAdmin();
  return <AdminReviewsClient />;
}
