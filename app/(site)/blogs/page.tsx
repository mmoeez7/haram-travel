import Link from "next/link";
import { createMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { BlogGuides } from "@/components/home/BlogGuides";

export const metadata = createMetadata({
  title: "Blogs & Pilgrim Guides",
  description:
    "Practical Umrah guides, packing checklists, hotel tips, and visa timelines for UK pilgrims.",
  path: "/blogs",
});

export default function BlogsPage() {
  return (
    <>
      <section className="bg-cream pt-12 pb-4">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Blogs" }]} />
          <h1 className="font-display text-3xl font-semibold uppercase tracking-wide text-charcoal md:text-5xl">
            Blogs &amp; Pilgrim Guides
          </h1>
          <p className="mt-4 max-w-2xl text-muted">
            Clear, verified guidance for British pilgrims — from packing lists to Nusuk timelines.{" "}
            <Link href="/#guides" className="font-semibold text-gold-dark hover:underline">
              Jump to guides
            </Link>
          </p>
        </div>
      </section>
      <BlogGuides />
    </>
  );
}
