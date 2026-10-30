import Image from "next/image";
import { notFound } from "next/navigation";
import { Check, MessageCircle, Phone } from "lucide-react";
import { createMetadata } from "@/lib/seo";
import { getPackageBySlug } from "@/lib/packages";
import { telUrl, whatsappUrl } from "@/lib/constants";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { CustomQuote } from "@/components/home/CustomQuote";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const pkg = await getPackageBySlug(slug);
  if (!pkg) {
    return { title: "Package not found" };
  }
  return createMetadata({
    title: pkg.title,
    description: `${pkg.subtitle}. From £${pkg.priceFrom}pp with UK flights and walking-distance hotels.`,
    path: `/packages/${slug}`,
  });
}

export default async function PackageDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const pkg = await getPackageBySlug(slug);
  if (!pkg) notFound();

  const waMessage = `Assalamu Alaikum, I'm interested in ${pkg.title} (${pkg.subtitle}) from £${pkg.priceFrom}pp.`;

  return (
    <>
      <section className="bg-cream pt-12 pb-10">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 lg:grid-cols-2 lg:px-6">
          <div>
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Umrah Packages", href: "/umrah-packages" },
                { label: pkg.title },
              ]}
            />
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-gold-dark">
              {pkg.badge || pkg.subtitle}
            </p>
            <h1 className="mt-2 font-display text-3xl font-semibold uppercase tracking-wide text-charcoal md:text-5xl">
              {pkg.title}
            </h1>
            <p className="mt-3 text-muted md:text-lg">{pkg.subtitle}</p>

            <div className="mt-6 grid grid-cols-2 gap-2">
              <div className="rounded-xl bg-white px-3 py-3 text-center text-sm font-medium text-ink">
                {String(pkg.makkahNights).padStart(2, "0")} Nights in Makkah
              </div>
              <div className="rounded-xl bg-white px-3 py-3 text-center text-sm font-medium text-ink">
                {String(pkg.madinahNights).padStart(2, "0")} Nights in Madinah
              </div>
            </div>

            <ul className="mt-6 space-y-2">
              {pkg.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm text-muted">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-forest" />
                  {feature}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex items-end justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted">From</p>
                <p className="font-display text-4xl font-semibold text-charcoal">
                  £{pkg.priceFrom.toLocaleString()}
                  <span className="text-base font-sans font-medium text-muted"> /pp</span>
                </p>
              </div>
              <span className="rounded-full bg-forest/10 px-3 py-1 text-xs font-semibold text-forest">
                Deposit: £{pkg.deposit}pp
              </span>
            </div>

            <div className="mt-6 grid gap-2 sm:grid-cols-2">
              <Button
                href={whatsappUrl(waMessage)}
                variant="whatsapp"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-4 w-4 text-white" />
                WhatsApp
              </Button>
              <Button href={telUrl()} variant="call">
                <Phone className="h-4 w-4" />
                Call Now
              </Button>
            </div>
            <Button href="/booking-form" variant="gold" className="mt-2 w-full">
              Inquire & Book Now →
            </Button>
          </div>

          <div className="relative min-h-[280px] overflow-hidden rounded-2xl border border-border bg-white shadow-sm md:min-h-[420px]">
            <Image
              src={pkg.image}
              alt={pkg.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
        </div>
      </section>
      <CustomQuote />
    </>
  );
}
