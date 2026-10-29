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
        <h1 className="font-display text-2xl font-semibold uppercase tracking-wide text-charcoal sm:text-3xl md:text-5xl">
          Privacy & Customer Data Policy
        </h1>

        <div className="mt-8 grid gap-6 md:mt-10 md:gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="h-fit rounded-xl border border-border bg-white p-4 md:rounded-2xl md:p-5 lg:sticky lg:top-28">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted md:mb-4">
              Policy Navigation
            </h2>
            <nav className="-mx-1 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:mx-0 lg:flex-col lg:space-y-2 lg:overflow-visible lg:pb-0 lg:gap-0">
              {privacySections.map((section, index) => (
                <Link
                  key={section.id}
                  href={`#${section.id}`}
                  className="flex shrink-0 items-start gap-2 rounded-lg px-2.5 py-2 text-xs text-ink transition hover:bg-cream hover:text-gold-dark md:text-sm lg:gap-2.5 lg:px-3"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-l from-gold to-gold-dark text-[10px] font-bold text-charcoal">
                    {index + 1}
                  </span>
                  <span className="max-w-[9.5rem] leading-snug lg:max-w-none">{section.title}</span>
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
