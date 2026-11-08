import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CardRail } from "@/components/ui/CardRail";
import { getPublishedPosts } from "@/lib/blogs";

export async function BlogGuides() {
  const posts = await getPublishedPosts(3);

  if (!posts.length) return null;

  return (
    <section id="guides" className="bg-cream py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Sacred Knowledge Hub"
          title="The British Pilgrim's Journal & Practical Guides"
          description="Clear, verified Sunnah guidance, packing checklists, and insider tips curated by our experienced UK Umrah directors."
        />
        <CardRail cols="md:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.id}
              className="card-lift overflow-hidden rounded-xl border border-border bg-white hover:border-gold/50 md:rounded-2xl"
            >
              <Link href={`/blogs/${post.slug}`} className="block">
                <div className="relative h-32 overflow-hidden bg-ivory sm:h-36 md:h-44">
                  {post.coverImageUrl ? (
                    <Image
                      src={post.coverImageUrl}
                      alt={post.coverImageAlt || post.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 80vw, 33vw"
                    />
                  ) : null}
                </div>
                <div className="p-4 md:p-6">
                  <h3 className="font-display text-base font-semibold text-charcoal md:text-xl">
                    {post.title}
                  </h3>
                  {post.excerpt ? (
                    <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-muted md:mt-3 md:text-sm">
                      {post.excerpt}
                    </p>
                  ) : null}
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-gold-dark md:mt-4">
                    Read more
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </span>
                </div>
              </Link>
            </article>
          ))}
        </CardRail>
        <div className="mt-8 text-center">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-1 text-sm font-semibold text-gold-dark hover:underline"
          >
            View all blogs
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
