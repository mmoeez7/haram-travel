import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import { ReviewFormClient } from "@/components/admin/ReviewFormClient";

export default async function EditTextReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const review = await prisma.textReview.findFirst({
    where: { id, deletedAt: null },
  });
  if (!review) notFound();
  return <ReviewFormClient kind="text" textReview={review} />;
}
