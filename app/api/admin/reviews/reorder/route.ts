import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdminApi, jsonError } from "@/lib/admin-api-auth";
import { writeAuditLog } from "@/lib/admin";

const reorderSchema = z.object({
  ids: z.array(z.string().min(1)).min(1),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

/**
 * Reorder video reviews on the current admin page.
 * Updates `sortOrder` so the public site shows them in this sequence.
 * (Neon HTTP adapter — no $transaction.)
 */
export async function PUT(request: Request) {
  const { session, error } = await requireAdminApi();
  if (error || !session) return error;

  const body = await request.json().catch(() => null);
  const parsed = reorderSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Invalid reorder payload");
  }

  const { ids, page, pageSize } = parsed.data;

  const all = await prisma.videoReview.findMany({
    where: { deletedAt: null },
    orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
    select: { id: true, sortOrder: true },
  });
  const allIds = all.map((row) => row.id);
  const start = (page - 1) * pageSize;
  const expected = allIds.slice(start, start + ids.length);

  if (
    expected.length !== ids.length ||
    expected.some((id) => !ids.includes(id)) ||
    ids.some((id) => !expected.includes(id))
  ) {
    return jsonError("List changed — refresh and try again.");
  }

  const nextIds = [...allIds];
  nextIds.splice(start, ids.length, ...ids);

  // Only write rows whose sortOrder actually changed
  for (let index = 0; index < nextIds.length; index += 1) {
    const id = nextIds[index]!;
    const current = all.find((row) => row.id === id);
    if (current?.sortOrder === index) continue;
    await prisma.videoReview.update({
      where: { id },
      data: { sortOrder: index },
    });
  }

  await writeAuditLog({
    adminUserId: session.user.id,
    action: "VIDEO_REVIEW_REORDER",
    entityType: "video_review",
    entityId: ids[0]!,
    metadata: { count: ids.length, page },
  });

  revalidatePath("/");
  revalidatePath("/reviews");
  revalidatePath("/pilgrim-reviews");
  revalidatePath("/customer-video-reviews");

  return NextResponse.json({ ok: true });
}
