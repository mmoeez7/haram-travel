import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { createMetadata } from "@/lib/seo";
import { getPublishedPosts } from "@/lib/blogs";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const metadata = createMetadata({
  title: "Blogs & Pilgrim Guides",
  description:
    "Practical Umrah guides, packing checklists, hotel tips, and visa timelines for UK pilgrims.",
  path: "/blogs",
});

function formatDate(value: Date | null) {
  if (!value) return null;
  return value.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogsPage() {
  const posts = await getPublishedPosts();

  return (
    <>
      <section className="bg-cream pt-12 pb-4">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Blogs" }]} />
          <h1 className="font-display text-3xl font-semibold uppercase tracking-wide text-charcoal md:text-5xl">
            Blogs &amp; Pilgrim Guides
          </h1>
          <p className="mt-4 max-w-2xl text-muted">
            Clear, verified guidance for British pilgrims — from packing lists to
            spiritual preparation for Umrah.
          </p>
        </div>
      </section>

      <section className="bg-cream pb-16 pt-6 md:pb-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          {posts.length === 0 ? (
            <p className="text-muted">
              No published articles yet. Please check back soon.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => {
                const dateLabel = formatDate(post.publishedAt);
                return (
                  <article
                    key={post.id}
                    className="card-lift overflow-hidden rounded-xl border border-border bg-white hover:border-gold/50 md:rounded-2xl"
                  >
                    <Link href={`/blogs/${post.slug}`} className="block">
                      <div className="relative h-40 overflow-hidden bg-ivory sm:h-44 md:h-48">
                        {post.coverImageUrl ? (
                          <Image
                            src={post.coverImageUrl}
                            alt={post.coverImageAlt || post.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                        ) : null}
                      </div>
                      <div className="p-4 md:p-6">
                        {dateLabel ? (
                          <p className="text-xs font-medium uppercase tracking-wide text-gold-dark">
                            {dateLabel}
                          </p>
                        ) : null}
                        <h2 className="mt-2 font-display text-lg font-semibold text-charcoal md:text-xl">
                          {post.title}
                        </h2>
                        {post.excerpt ? (
                          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">
                            {post.excerpt}
                          </p>
                        ) : null}
                        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-gold-dark">
                          Read more
                          <ArrowRight className="h-4 w-4" aria-hidden />
                        </span>
                      </div>
                    </Link>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
