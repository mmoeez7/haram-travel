import "server-only";

import { prisma } from "@/lib/db";
import {
  TESTIMONIALS_PAGE_SIZE,
  type Testimonial,
  type TestimonialsPage,
} from "@/lib/testimonial-types";

export type { Testimonial, TestimonialsPage };
export { TESTIMONIALS_PAGE_SIZE };

const testimonialSelect = {
  id: true,
  title: true,
  name: true,
  initial: true,
  text: true,
} as const;

const publishedWhere = { deletedAt: null, published: true } as const;

export async function getTestimonials(limit?: number): Promise<Testimonial[]> {
  const rows = await prisma.textReview.findMany({
    where: publishedWhere,
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    ...(limit ? { take: limit } : {}),
    select: testimonialSelect,
  });
  return Array.isArray(rows) ? rows : [];
}

export async function getTestimonialsPage({
  offset = 0,
  limit = TESTIMONIALS_PAGE_SIZE,
}: {
  offset?: number;
  limit?: number;
} = {}): Promise<TestimonialsPage> {
  const safeOffset = Math.max(0, Math.floor(offset));
  const safeLimit = Math.min(20, Math.max(1, Math.floor(limit)));

  const [total, rows] = await Promise.all([
    prisma.textReview.count({ where: publishedWhere }),
    prisma.textReview.findMany({
      where: publishedWhere,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      skip: safeOffset,
      take: safeLimit,
      select: testimonialSelect,
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
