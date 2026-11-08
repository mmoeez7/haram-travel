import Image from "next/image";
import { notFound } from "next/navigation";
import { createMetadata } from "@/lib/seo";
import { getPostBySlug } from "@/lib/blogs";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { BlogContent } from "@/components/content/BlogContent";
import { CustomQuote } from "@/components/home/CustomQuote";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) {
    return createMetadata({
      title: "Blog",
      description: "Umrah guides from Haram Travel.",
      path: `/blogs/${slug}`,
    });
  }

  return createMetadata({
    title: post.metaTitle?.trim() || post.title,
    description:
      post.metaDescription?.trim() ||
      post.excerpt?.trim() ||
      `${post.title} — Haram Travel pilgrim guide.`,
    path: `/blogs/${post.slug}`,
  });
}

function formatDate(value: Date | null) {
  if (!value) return null;
  return value.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const dateLabel = formatDate(post.publishedAt);

  return (
    <>
      <article>
        <section className="bg-cream pt-12 pb-6">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Blogs", href: "/blogs" },
                { label: post.title },
              ]}
            />
            {dateLabel ? (
              <p className="mt-4 text-xs font-medium uppercase tracking-wide text-gold-dark">
                {dateLabel}
              </p>
            ) : null}
            <h1 className="mt-2 font-display text-3xl font-semibold tracking-wide text-charcoal md:text-5xl">
              {post.title}
            </h1>
            {post.excerpt ? (
              <p className="mt-4 max-w-3xl text-muted">{post.excerpt}</p>
            ) : null}
          </div>
        </section>

        {post.coverImageUrl ? (
          <section className="bg-cream pb-8">
            <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
              <div className="relative aspect-[21/9] overflow-hidden rounded-2xl">
                <Image
                  src={post.coverImageUrl}
                  alt={post.coverImageAlt || post.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="100vw"
                />
              </div>
            </div>
          </section>
        ) : null}

        <section className="bg-cream pb-12 md:pb-16">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <BlogContent html={post.content} />
          </div>
        </section>
      </article>
      <CustomQuote />
    </>
  );
}
