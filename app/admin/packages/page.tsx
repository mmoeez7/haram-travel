import { requireAdmin } from "@/lib/admin";
import { AdminPackagesClient } from "@/components/admin/AdminPackagesClient";

export default async function AdminPackagesPage() {
  await requireAdmin();
  return <AdminPackagesClient />;
}
