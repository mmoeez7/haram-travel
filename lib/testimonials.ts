import "server-only";

import { prisma } from "@/lib/db";

export type Testimonial = {
  id: string;
  title: string;
  name: string;
  initial: string;
  text: string;
};

export async function getTestimonials(limit?: number): Promise<Testimonial[]> {
  const rows = await prisma.textReview.findMany({
    where: { deletedAt: null, published: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    ...(limit ? { take: limit } : {}),
    select: {
      id: true,
      title: true,
      name: true,
      initial: true,
      text: true,
    },
  });
  return Array.isArray(rows) ? rows : [];
}
