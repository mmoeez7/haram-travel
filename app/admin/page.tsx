import { requireAdmin } from "@/lib/admin";
import { AdminDashboardClient } from "@/components/admin/AdminDashboardClient";

export default async function AdminDashboardPage() {
  await requireAdmin();
  return <AdminDashboardClient />;
}
