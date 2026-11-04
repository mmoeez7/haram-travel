import { notFound } from "next/navigation";
import { createMetadata } from "@/lib/seo";
import { getPackageDetailBySlug } from "@/lib/packages";
import { packageHref } from "@/lib/package-paths";
import { PackageDetailHero } from "@/components/packages/PackageDetailHero";
import { PackageDetailBody } from "@/components/packages/PackageDetailBody";
import { PackageHotelDetails } from "@/components/packages/PackageHotelDetails";
import { PackageDetailSidebar } from "@/components/packages/PackageDetailSidebar";
import { PackageTrustStrip } from "@/components/packages/PackageTrustStrip";
import { CustomQuote } from "@/components/home/CustomQuote";
import { Testimonials } from "@/components/home/Testimonials";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const pkg = await getPackageDetailBySlug(slug);
  if (!pkg) {
    return { title: "Package not found" };
  }
  return createMetadata({
    title: pkg.title,
    description:
      pkg.shortDescription?.trim() ||
      `${pkg.subtitle}. From £${pkg.priceFrom}pp with UK flights and walking-distance hotels.`,
    path: packageHref(slug),
  });
}

export default async function PackageDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const pkg = await getPackageDetailBySlug(slug);
  if (!pkg) notFound();

  return (
    <>
      <section className="bg-cream pt-10 pb-12 md:pt-12 md:pb-16">
        <div className="mx-auto max-w-7xl px-3 lg:px-4">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start lg:gap-10">
            <div className="space-y-10 md:space-y-12">
              <PackageDetailHero pkg={pkg} />
              <PackageDetailBody pkg={pkg} />
            </div>

            <div className="lg:pt-10">
              <PackageDetailSidebar pkg={pkg} />
            </div>
          </div>

          <div className="mt-10 md:mt-12">
            <PackageHotelDetails hotels={pkg.hotelRefs} />
          </div>

          <div className="mt-10 md:mt-12">
            <PackageTrustStrip />
          </div>
        </div>
      </section>

      <CustomQuote />
      <Testimonials />
    </>
  );
}
