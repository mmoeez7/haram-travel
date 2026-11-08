import { getUmrahByStars } from "@/lib/packages";
import { getCategorySeoContent } from "@/lib/categories";
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

export async function StarPackagesPage({
  stars,
  title,
  description,
  pathLabel,
}: StarPackagesPageProps) {
  const [packages, seoContent] = await Promise.all([
    getUmrahByStars(stars),
    getCategorySeoContent(STAR_SLUG[stars]),
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
          <h1 className="font-display text-3xl font-semibold uppercase tracking-wide text-charcoal md:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-muted">{description}</p>
        </div>
      </section>
      <PackageSection title={title} description={description} packages={packages} />
      <SeoContent html={seoContent} />
      <CustomQuote />
    </>
  );
}
