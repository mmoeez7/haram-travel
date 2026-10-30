import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import { CategoryFormClient } from "@/components/admin/CategoryFormClient";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const category = await prisma.category.findFirst({
    where: { id, deletedAt: null },
  });
  if (!category) notFound();
  return <CategoryFormClient category={category} />;
}
