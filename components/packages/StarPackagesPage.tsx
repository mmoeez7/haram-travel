import { getUmrahByStars } from "@/lib/packages";
import { starListingCardTitle } from "@/lib/package-card-title";
import { getCategorySeoBlock } from "@/lib/categories";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { PackageSection } from "@/components/packages/PackageSection";
import { CustomQuote } from "@/components/home/CustomQuote";
import { SeoContent } from "@/components/content/SeoContent";

type StarPackagesPageProps = {
  stars: 3 | 4 | 5;
  title: string;
  description: string;
  pathLabel: string;
};

const STAR_SLUG: Record<3 | 4 | 5, string> = {
  3: "3-star",
  4: "4-star",
  5: "5-star",
};

const STAR_SECTION: Record<3 | 4 | 5, { title: string; description: string }> = {
  3: {
    title: "Explore 3 Star Packages",
    description:
      "Choose from affordable Umrah packages with comfortable hotels in Makkah and Madinah. Select your preferred trip duration.",
  },
  4: {
    title: "Explore 4 Star Packages",
    description:
      "Discover quality hotels in Makkah and Madinah, with comfortable accommodation and convenient travel arrangements.",
  },
  5: {
    title: "Explore 5 Star Packages",
    description:
      "Discover premium hotels in Makkah and Madinah, offering luxury, exceptional hospitality and superior comfort.",
  },
};

export async function StarPackagesPage({
  stars,
  title,
  description,
  pathLabel,
}: StarPackagesPageProps) {
  const [packages, seo] = await Promise.all([
    getUmrahByStars(stars),
    getCategorySeoBlock(STAR_SLUG[stars]),
  ]);

  return (
    <>
      <section className="bg-cream pt-12 pb-6">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Umrah Packages", href: "/umrah-packages" },
              { label: pathLabel },
            ]}
          />
          <h1 className="break-words font-display text-xl font-semibold uppercase leading-snug tracking-wide text-charcoal sm:text-3xl md:text-4xl lg:text-5xl">
            {title}
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-muted sm:mt-4 sm:text-base">
            {description}
          </p>
        </div>
      </section>
      <PackageSection
        title={STAR_SECTION[stars].title}
        description={STAR_SECTION[stars].description}
        packages={packages}
        titleOverride={starListingCardTitle(stars)}
      />
      <SeoContent html={seo.html} imageSrc={seo.imageSrc} imageAlt={seo.imageAlt} />
      <CustomQuote />
    </>
  );
}
