import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdminApi, jsonError } from "@/lib/admin-api-auth";
import { writeAuditLog } from "@/lib/admin";
import { videoReviewSchema } from "@/lib/admin-schemas";
import { extractYoutubeId } from "@/lib/youtube";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { error } = await requireAdminApi();
  if (error) return error;
  const { id } = await params;

  const review = await prisma.videoReview.findFirst({
    where: { id, deletedAt: null },
  });
  if (!review) return jsonError("Review not found", 404);
  return NextResponse.json({ review });
}

export async function PATCH(request: Request, { params }: Params) {
  const { session, error } = await requireAdminApi();
  if (error || !session) return error;
  const { id } = await params;
  const body = await request.json();

  const existing = await prisma.videoReview.findFirst({
    where: { id, deletedAt: null },
  });
  if (!existing) return jsonError("Review not found", 404);

  const parsed = videoReviewSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Invalid review");
  }

  const youtubeId = extractYoutubeId(parsed.data.videoUrl);
  if (!youtubeId) return jsonError("Enter a valid YouTube video link");

  const review = await prisma.videoReview.update({
    where: { id },
    data: {
      videoUrl: parsed.data.videoUrl.trim(),
      youtubeId,
      description: parsed.data.description.trim(),
      title: parsed.data.title?.trim() || "Customer Umrah Experience",
      cta: parsed.data.cta?.trim() || "Watch Story",
      sortOrder: parsed.data.sortOrder,
      published: parsed.data.published,
    },
  });

  await writeAuditLog({
    adminUserId: session.user.id,
    action: "VIDEO_REVIEW_UPDATE",
    entityType: "video_review",
    entityId: review.id,
    metadata: { youtubeId },
  });

  revalidatePath("/");
  revalidatePath("/pilgrim-reviews");
  return NextResponse.json({ review });
}

export async function DELETE(_request: Request, { params }: Params) {
  const { session, error } = await requireAdminApi();
  if (error || !session) return error;
  const { id } = await params;

  const existing = await prisma.videoReview.findFirst({
    where: { id, deletedAt: null },
  });
  if (!existing) return jsonError("Review not found", 404);

  await prisma.videoReview.update({
    where: { id },
    data: { deletedAt: new Date(), published: false },
  });

  await writeAuditLog({
    adminUserId: session.user.id,
    action: "VIDEO_REVIEW_DELETE",
    entityType: "video_review",
    entityId: id,
  });

  revalidatePath("/");
  revalidatePath("/pilgrim-reviews");
  return NextResponse.json({ ok: true });
}
