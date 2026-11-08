import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireAdminApi, jsonError } from "@/lib/admin-api-auth";
import { writeAuditLog } from "@/lib/admin";
import { videoReviewSchema } from "@/lib/admin-schemas";
import { extractYoutubeId } from "@/lib/youtube";
import {
  buildPaginationMeta,
  parseAdminPage,
  parseAdminPageSize,
} from "@/lib/admin-pagination";
import { revalidatePath } from "next/cache";

export async function GET(request: Request) {
  const { error } = await requireAdminApi();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const q = searchParams.get("q")?.trim();
  const page = parseAdminPage(searchParams);
  const pageSize = parseAdminPageSize(searchParams);

  const where: Prisma.VideoReviewWhereInput = {
    deletedAt: null,
    ...(status === "draft" ? { published: false } : {}),
    ...(status === "published" ? { published: true } : {}),
    ...(q
      ? {
          OR: [
            { description: { contains: q, mode: "insensitive" } },
            { title: { contains: q, mode: "insensitive" } },
            { youtubeId: { contains: q, mode: "insensitive" } },
            { videoUrl: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  if (page === null) {
    const reviews = await prisma.videoReview.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
    });
    return NextResponse.json({ reviews });
  }

  const total = await prisma.videoReview.count({ where });
  const pagination = buildPaginationMeta(total, page, pageSize);
  const reviews = await prisma.videoReview.findMany({
    where,
    orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
    skip: (pagination.page - 1) * pagination.pageSize,
    take: pagination.pageSize,
  });

  return NextResponse.json({ reviews, pagination });
}

export async function POST(request: Request) {
  const { session, error } = await requireAdminApi();
  if (error || !session) return error;

  const body = await request.json();
  const parsed = videoReviewSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Invalid review");
  }

  const youtubeId = extractYoutubeId(parsed.data.videoUrl);
  if (!youtubeId) return jsonError("Enter a valid YouTube video link");

  const review = await prisma.videoReview.create({
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
    action: "VIDEO_REVIEW_CREATE",
    entityType: "video_review",
    entityId: review.id,
    metadata: { youtubeId },
  });

  revalidatePath("/");
  revalidatePath("/pilgrim-reviews");
  return NextResponse.json({ review }, { status: 201 });
}
