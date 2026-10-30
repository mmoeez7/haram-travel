import { createMetadata } from "@/lib/seo";
import { getHajjPackages } from "@/lib/packages";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { PackageSection } from "@/components/packages/PackageSection";
import { CustomQuote } from "@/components/home/CustomQuote";

export const metadata = createMetadata({
  title: "Hajj Packages",
  description:
    "Structured and compliant Hajj packages from the UK with visas, hotels, tent camps, and experienced guidance. From £6,495pp.",
  path: "/hajj-packages",
});

export default async function HajjPackagesPage() {
  const packages = await getHajjPackages();

  return (
    <>
      <section className="bg-cream pt-12 pb-6">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Hajj Packages" }]} />
          <h1 className="font-display text-4xl font-semibold uppercase tracking-wide text-charcoal md:text-5xl">
            Hajj Packages from the UK
          </h1>
          <p className="mt-4 max-w-2xl text-muted">
            Structured, Ministry-compliant Hajj programmes with full support — from economy group
            packages to VIP elite experiences.
          </p>
        </div>
      </section>
      <PackageSection
        eyebrow="Full Hajj Programmes"
        title="Choose Your Hajj Package"
        description="Economy to VIP elite options with flights, visas, Mina/Arafah arrangements, and dedicated guidance."
        packages={packages}
      />
      <CustomQuote />
    </>
  );
}
