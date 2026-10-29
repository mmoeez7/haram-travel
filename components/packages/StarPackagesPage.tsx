import { getUmrahByStars } from "@/lib/packages";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { PackageSection } from "@/components/packages/PackageSection";
import { CustomQuote } from "@/components/home/CustomQuote";

type StarPackagesPageProps = {
  stars: 3 | 4 | 5;
  title: string;
  description: string;
  pathLabel: string;
};

export function StarPackagesPage({
  stars,
  title,
  description,
  pathLabel,
}: StarPackagesPageProps) {
  return (
    <>
      <section className="bg-cream pt-12 pb-6">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
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
      <PackageSection
        title={title}
        description={description}
        packages={getUmrahByStars(stars)}
      />
      <CustomQuote />
    </>
  );
}
