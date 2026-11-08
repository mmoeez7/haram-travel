import { requireAdmin } from "@/lib/admin";
import { AdminBlogsClient } from "@/components/admin/AdminBlogsClient";

export default async function AdminBlogsPage() {
  await requireAdmin();
  return <AdminBlogsClient />;
}
