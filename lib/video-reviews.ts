import { unstable_noStore as noStore } from "next/cache";
import { prisma } from "@/lib/db";

export type PublicVideoReview = {
  id: string;
  youtubeId: string;
  title: string;
  description: string;
  cta: string;
};

export async function getPublishedVideoReviews(): Promise<PublicVideoReview[]> {
  noStore();

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
