import Link from "next/link";
import { createMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { PrivacyContent, privacySections } from "@/components/privacy/PrivacyContent";

export const metadata = createMetadata({
  title: "Privacy & Customer Data Policy",
  description:
    "Privacy policy for Bukhari Travel T/A Haram Travel — how we collect, use, and protect pilgrim data.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <section className="bg-cream py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]} />
        <span className="mb-3 inline-block rounded-full bg-gold-soft/60 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-gold-dark">
          Customer Terms & Data Policy
        </span>
        <h1 className="font-display text-4xl font-semibold uppercase tracking-wide text-charcoal md:text-5xl">
          Privacy & Customer Data Policy
        </h1>

        <div className="mt-10 grid gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="h-fit rounded-2xl border border-border bg-white p-5 lg:sticky lg:top-28">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted">
              Policy Navigation
            </h2>
            <nav className="space-y-2">
              {privacySections.map((section, index) => (
                <Link
                  key={section.id}
                  href={`#${section.id}`}
                  className="block rounded-lg px-3 py-2 text-sm text-ink transition hover:bg-cream hover:text-gold-dark"
                >
                  {index + 1}. {section.title.split("&")[0].trim()}
                </Link>
              ))}
            </nav>
          </aside>
          <PrivacyContent />
        </div>
      </div>
    </section>
  );
}
