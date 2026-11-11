import "server-only";

import { prisma } from "@/lib/db";

export type PublicBlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  coverImageUrl: string | null;
  coverImageAlt: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  publishedAt: Date | null;
};

export type PublicBlogCard = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImageUrl: string | null;
  coverImageAlt: string | null;
  publishedAt: Date | null;
};

export async function getPublishedPosts(limit?: number): Promise<PublicBlogCard[]> {
  const posts = await prisma.blogPost.findMany({
    where: { deletedAt: null, published: true },
    orderBy: [
      { publishedAt: "desc" },
      { sortOrder: "asc" },
      { updatedAt: "desc" },
    ],
    ...(limit ? { take: limit } : {}),
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      coverImageUrl: true,
      coverImageAlt: true,
      publishedAt: true,
    },
  });

  return posts;
}

export async function getPostBySlug(slug: string): Promise<PublicBlogPost | null> {
  const post = await prisma.blogPost.findFirst({
    where: { slug, deletedAt: null, published: true },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      content: true,
      coverImageUrl: true,
      coverImageAlt: true,
      metaTitle: true,
      metaDescription: true,
      publishedAt: true,
    },
  });

  return post;
}
