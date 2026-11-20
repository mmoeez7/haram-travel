import "server-only";

import { prisma } from "@/lib/db";
import {
  VIDEO_REVIEWS_PAGE_SIZE,
  type PublicVideoReview,
  type VideoReviewsPage,
} from "@/lib/video-review-types";

export type { PublicVideoReview, VideoReviewsPage };
export { VIDEO_REVIEWS_PAGE_SIZE };

const publishedWhere = { deletedAt: null, published: true } as const;

const videoSelect = {
  id: true,
  youtubeId: true,
  title: true,
  description: true,
  cta: true,
} as const;

export async function getPublishedVideoReviews(
  limit?: number
): Promise<PublicVideoReview[]> {
  return prisma.videoReview.findMany({
    where: publishedWhere,
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    ...(limit ? { take: limit } : {}),
    select: videoSelect,
  });
}

export async function getPublishedVideoReviewsPage({
  offset = 0,
  limit = VIDEO_REVIEWS_PAGE_SIZE,
}: {
  offset?: number;
  limit?: number;
} = {}): Promise<VideoReviewsPage> {
  const safeOffset = Math.max(0, Math.floor(offset));
  const safeLimit = Math.min(20, Math.max(1, Math.floor(limit)));

  const [total, rows] = await Promise.all([
    prisma.videoReview.count({ where: publishedWhere }),
    prisma.videoReview.findMany({
      where: publishedWhere,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      skip: safeOffset,
      take: safeLimit,
      select: videoSelect,
    }),
  ]);

  const reviews = Array.isArray(rows) ? rows : [];
  return {
    reviews,
    total,
    offset: safeOffset,
    limit: safeLimit,
    hasMore: safeOffset + reviews.length < total,
  };
}
