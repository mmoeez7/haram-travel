import Image from "next/image";
import { notFound } from "next/navigation";
import { createMetadata } from "@/lib/seo";
import {
  getCategoryBySlug,
  getPackagesByCategorySlug,
} from "@/lib/categories";
import { UMRAH_DEALS_ROOT_SLUG } from "@/lib/category-roots";
import { categoryListingHref } from "@/lib/package-paths";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { PackageSection } from "@/components/packages/PackageSection";
import { StarGroupedPackages } from "@/components/packages/StarGroupedPackages";
import { CustomQuote } from "@/components/home/CustomQuote";
import { Testimonials } from "@/components/home/Testimonials";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) {
    return createMetadata({
      title: "Category",
      description: "Umrah packages by category.",
      path: categoryListingHref(slug),
    });
  }

  return createMetadata({
    title: `${category.name} | ${category.parent.name}`,
    description:
      category.description?.trim() ||
      `${category.name} packages from Haram Travel — UK departures, ATOL protected.`,
    path: categoryListingHref(category.slug),
  });
}

export default async function CategoryPackagesPage({ params }: PageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const packages = await getPackagesByCategorySlug(slug);
  const isDeal = category.parent.slug === UMRAH_DEALS_ROOT_SLUG;

  const hasCover = Boolean(category.coverImageUrl);

  return (
    <>
      <section
        className={`relative overflow-hidden ${
          hasCover ? "min-h-[360px] text-white md:min-h-[460px]" : "bg-cream"
        }`}
      >
        {hasCover ? (
          <>
            <Image
              src={category.coverImageUrl!}
              alt={category.coverImageAlt || category.name}
              fill
              priority
              className="object-cover object-center"
              sizes="100vw"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/45 to-black/30"
              aria-hidden
            />
          </>
        ) : null}

        <div
          className={`relative z-10 mx-auto flex max-w-7xl flex-col items-center justify-center px-3 text-center lg:px-4 ${
            hasCover ? "min-h-[360px] py-16 md:min-h-[460px] md:py-24" : "pt-12 pb-6"
          }`}
        >
          <div className="[&_ol]:justify-center">
            <Breadcrumbs
              tone={hasCover ? "onDark" : "default"}
              items={[
                { label: "Home", href: "/" },
                {
                  label: category.parent.name,
                  href: "/umrah-packages",
                },
                { label: category.name },
              ]}
            />
          </div>
          <h1
            className={`font-display text-5xl font-semibold uppercase tracking-wide md:text-6xl lg:text-7xl ${
              hasCover ? "text-white" : "text-charcoal"
            }`}
          >
            Explore {category.name}
          </h1>
          <p
            className={`mx-auto mt-4 max-w-2xl ${
              hasCover ? "text-white/90" : "text-muted"
            }`}
          >
            {category.description?.trim() ||
              (isDeal
                ? `Seasonal ${category.name} Umrah deals from the UK with flights, hotels and visas.`
                : `${category.name} Umrah packages from the UK with flights included and ATOL protection.`)}
          </p>
        </div>
      </section>

      {packages.length ? (
        isDeal ? (
          <StarGroupedPackages
            packages={packages}
            eyebrow={category.parent.name}
          />
        ) : (
          <PackageSection
            eyebrow={category.parent.name}
            title={`${category.name} packages`}
            description={`Browse published packages in ${category.name}.`}
            packages={packages}
          />
        )
      ) : (
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-3 lg:px-4">
            <p className="text-muted">
              No published packages in this category yet. Please check back soon or contact our
              advisors for a bespoke quote.
            </p>
          </div>
        </section>
      )}

      <CustomQuote />
      <Testimonials />
    </>
  );
}
