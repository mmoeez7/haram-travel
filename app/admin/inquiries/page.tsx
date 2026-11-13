import { requireAdmin } from "@/lib/admin";
import { AdminInquiriesClient } from "@/components/admin/AdminInquiriesClient";

export default async function AdminInquiriesPage() {
  await requireAdmin();
  return <AdminInquiriesClient />;
}
