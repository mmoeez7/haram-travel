import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireAdminApi, jsonError } from "@/lib/admin-api-auth";
import { writeAuditLog } from "@/lib/admin";
import { textReviewSchema } from "@/lib/admin-schemas";
import {
  buildPaginationMeta,
  parseAdminPage,
  parseAdminPageSize,
} from "@/lib/admin-pagination";
import { revalidatePath } from "next/cache";

function revalidateTextReviewPaths() {
  revalidatePath("/");
  revalidatePath("/pilgrim-reviews");
  revalidatePath("/customer-reviews");
}

export async function GET(request: Request) {
  const { error } = await requireAdminApi();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const q = searchParams.get("q")?.trim();
  const page = parseAdminPage(searchParams);
  const pageSize = parseAdminPageSize(searchParams);

  const where: Prisma.TextReviewWhereInput = {
    deletedAt: null,
    ...(status === "draft" ? { published: false } : {}),
    ...(status === "published" ? { published: true } : {}),
    ...(q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { name: { contains: q, mode: "insensitive" } },
            { text: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  if (page === null) {
    const reviews = await prisma.textReview.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
    });
    return NextResponse.json({ reviews });
  }

  const total = await prisma.textReview.count({ where });
  const pagination = buildPaginationMeta(total, page, pageSize);
  const reviews = await prisma.textReview.findMany({
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
  const parsed = textReviewSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Invalid review");
  }

  const review = await prisma.textReview.create({
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
    action: "TEXT_REVIEW_CREATE",
    entityType: "text_review",
    entityId: review.id,
    metadata: { name: review.name },
  });

  revalidateTextReviewPaths();
  return NextResponse.json({ review }, { status: 201 });
}
