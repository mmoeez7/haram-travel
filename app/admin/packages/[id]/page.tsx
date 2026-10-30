import { requireAdmin } from "@/lib/admin";
import { PackageFormClient } from "@/components/admin/PackageFormClient";

export default async function EditPackagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  return <PackageFormClient packageId={id} />;
}
