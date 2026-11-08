import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import { ReviewFormClient } from "@/components/admin/ReviewFormClient";

export default async function EditReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const review = await prisma.videoReview.findFirst({
    where: { id, deletedAt: null },
  });
  if (!review) notFound();
  return <ReviewFormClient review={review} />;
}
