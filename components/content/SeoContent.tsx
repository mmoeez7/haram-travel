import Image from "next/image";
import { sanitizeSeoHtml } from "@/lib/sanitize-html";

type SeoContentProps = {
  html: string | null | undefined;
  imageSrc?: string | null;
  imageAlt?: string | null;
};

const DEFAULT_IMAGE = {
  src: "/images/hero-bg.jpg",
  alt: "Masjid al-Haram and the Kaaba in Makkah",
};

export function SeoContent({ html, imageSrc, imageAlt }: SeoContentProps) {
  const clean = sanitizeSeoHtml(html);
  if (!clean) return null;

  const src = imageSrc?.trim() || DEFAULT_IMAGE.src;
  const alt = imageAlt?.trim() || DEFAULT_IMAGE.alt;

  return (
    <section className="bg-cream py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="seo-scroll relative max-h-[min(60vh,36rem)] overflow-y-auto rounded-[1.75rem] border border-white/70 bg-white/45 shadow-[0_18px_50px_-20px_rgba(26,26,26,0.35)] backdrop-blur-md">
          <div className="pointer-events-none sticky top-0 z-0 h-0" aria-hidden>
            <div className="relative h-[min(60vh,36rem)] w-full">
              <Image
                src={src}
                alt={alt}
                fill
                sizes="(max-width: 1280px) 100vw, 1280px"
                className="object-cover object-center opacity-35"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-white/75 via-cream/70 to-white/80" />
            </div>
          </div>
          <div
            className="seo-content relative z-10 space-y-4 px-6 py-7 text-base leading-relaxed text-charcoal/80 md:px-10 md:py-9 [&_a]:text-gold-dark [&_a]:underline [&_h1]:mb-4 [&_h1]:font-display [&_h1]:text-2xl [&_h1]:font-semibold [&_h1]:leading-snug [&_h1]:tracking-tight [&_h1]:text-charcoal md:[&_h1]:text-3xl [&_h2]:mt-6 [&_h2]:mb-3 [&_h2]:border-l-[3px] [&_h2]:border-gold [&_h2]:pl-3.5 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-charcoal md:[&_h2]:text-2xl [&_h3]:mt-5 [&_h3]:mb-2 [&_h3]:border-l-[3px] [&_h3]:border-gold [&_h3]:pl-3.5 [&_h3]:font-display [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-charcoal [&_h4]:font-semibold [&_h4]:text-charcoal [&_li]:my-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-3 [&_strong]:text-charcoal [&_ul]:list-disc [&_ul]:pl-5"
            dangerouslySetInnerHTML={{ __html: clean }}
          />
        </div>
      </div>
    </section>
  );
}
