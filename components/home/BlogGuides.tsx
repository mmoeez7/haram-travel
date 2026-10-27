import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";

const guides = [
  {
    title: "First-Time Umrah Packing Checklist",
    excerpt: "Essentials, ihram guidance, and practical tips for British pilgrims.",
  },
  {
    title: "Walking Distance Hotels Explained",
    excerpt: "How we verify courtyard proximity so elderly parents walk with ease.",
  },
  {
    title: "Visa & Nusuk Timeline Guide",
    excerpt: "What documents you need and when to submit them before departure.",
  },
];

export function BlogGuides() {
  return (
    <section id="guides" className="bg-cream py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <SectionHeading
          eyebrow="Sacred Knowledge Hub"
          title="The British Pilgrim's Journal & Practical Guides"
          description="Clear, verified Sunnah guidance, packing checklists, and insider tips curated by our experienced UK Umrah directors."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {guides.map((guide) => (
            <article
              key={guide.title}
              className="rounded-2xl border border-border bg-white p-6 transition hover:border-gold/50"
            >
              <div className="mb-5 h-36 rounded-xl bg-gradient-to-br from-cream-dark to-gold-soft/40" />
              <h3 className="font-display text-xl font-semibold text-charcoal">{guide.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{guide.excerpt}</p>
              <Link
                href="/about-us"
                className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-gold-dark hover:text-gold"
              >
                Read guide <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
