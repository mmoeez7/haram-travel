import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";

const guides = [
  {
    title: "First-Time Umrah Packing Checklist",
    excerpt: "Essentials, ihram guidance, and practical tips for British pilgrims.",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
  },
  {
    title: "Walking Distance Hotels Explained",
    excerpt: "How we verify courtyard proximity so elderly parents walk with ease.",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
  },
  {
    title: "Visa & Nusuk Timeline Guide",
    excerpt: "What documents you need and when to submit them before departure.",
    image:
      "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=800&q=80",
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
              className="overflow-hidden rounded-2xl border border-border bg-white transition hover:border-gold/50"
            >
              <div className="relative h-44 overflow-hidden">
                <Image
                  src={guide.image}
                  alt={guide.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-6">
                <h3 className="font-display text-xl font-semibold text-charcoal">{guide.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{guide.excerpt}</p>
                <Link
                  href="/about-us"
                  className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-gold-dark hover:text-gold"
                >
                  Read guide <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
