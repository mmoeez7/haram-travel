import { requireAdmin } from "@/lib/admin";
import { AdminHotelsClient } from "@/components/admin/AdminHotelsClient";

export default async function AdminHotelsPage() {
  await requireAdmin();
  return <AdminHotelsClient />;
}
