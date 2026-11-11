import "server-only";

import { prisma } from "@/lib/db";

export type PublicVideoReview = {
  id: string;
  youtubeId: string;
  title: string;
  description: string;
  cta: string;
};

export async function getPublishedVideoReviews(): Promise<PublicVideoReview[]> {
  return prisma.videoReview.findMany({
    where: { deletedAt: null, published: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    select: {
      id: true,
      youtubeId: true,
      title: true,
      description: true,
      cta: true,
    },
  });
}
