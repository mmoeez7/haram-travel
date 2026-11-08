import { sanitizeSeoHtml } from "@/lib/sanitize-html";

type SeoContentProps = {
  html: string | null | undefined;
};

export function SeoContent({ html }: SeoContentProps) {
  const clean = sanitizeSeoHtml(html);
  if (!clean) return null;

  return (
    <section className="bg-cream py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div
          className="seo-content space-y-4 text-base leading-relaxed text-muted [&_a]:text-gold [&_a]:underline [&_h1]:font-display [&_h1]:text-3xl [&_h1]:font-semibold [&_h1]:uppercase [&_h1]:tracking-wide [&_h1]:text-charcoal [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-charcoal [&_h3]:font-display [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-charcoal [&_h4]:font-semibold [&_h4]:text-charcoal [&_li]:my-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-3 [&_strong]:text-charcoal [&_ul]:list-disc [&_ul]:pl-5"
          dangerouslySetInnerHTML={{ __html: clean }}
        />
      </div>
    </section>
  );
}
