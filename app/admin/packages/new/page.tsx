import { requireAdmin } from "@/lib/admin";
import { PackageFormClient } from "@/components/admin/PackageFormClient";

export default async function NewPackagePage() {
  await requireAdmin();
  return <PackageFormClient />;
}
