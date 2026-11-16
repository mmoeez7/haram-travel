import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminApi, jsonError } from "@/lib/admin-api-auth";
import { writeAuditLog } from "@/lib/admin";
import { textReviewSchema } from "@/lib/admin-schemas";
import { revalidatePath } from "next/cache";

type Params = { params: Promise<{ id: string }> };

function revalidateTextReviewPaths() {
  revalidatePath("/");
  revalidatePath("/pilgrim-reviews");
  revalidatePath("/customer-reviews");
}

export async function PATCH(request: Request, { params }: Params) {
  const { session, error } = await requireAdminApi();
  if (error || !session) return error;
  const { id } = await params;

  const existing = await prisma.textReview.findFirst({
    where: { id, deletedAt: null },
  });
  if (!existing) return jsonError("Review not found", 404);

  const body = await request.json();
  const parsed = textReviewSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Invalid review");
  }

  const review = await prisma.textReview.update({
    where: { id },
    data: {
      title: parsed.data.title.trim(),
      name: parsed.data.name.trim(),
      initial: parsed.data.initial.slice(0, 2),
      text: parsed.data.text.trim(),
      sortOrder: parsed.data.sortOrder,
      published: parsed.data.published,
    },
  });

  await writeAuditLog({
    adminUserId: session.user.id,
    action: "TEXT_REVIEW_UPDATE",
    entityType: "text_review",
    entityId: review.id,
    metadata: { name: review.name },
  });

  revalidateTextReviewPaths();
  return NextResponse.json({ review });
}

export async function DELETE(_request: Request, { params }: Params) {
  const { session, error } = await requireAdminApi();
  if (error || !session) return error;
  const { id } = await params;

  const existing = await prisma.textReview.findFirst({
    where: { id, deletedAt: null },
  });
  if (!existing) return jsonError("Review not found", 404);

  await prisma.textReview.update({
    where: { id },
    data: { deletedAt: new Date(), published: false },
  });

  await writeAuditLog({
    adminUserId: session.user.id,
    action: "TEXT_REVIEW_DELETE",
    entityType: "text_review",
    entityId: id,
  });

  revalidateTextReviewPaths();
  return NextResponse.json({ ok: true });
}
