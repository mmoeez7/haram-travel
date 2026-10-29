import type { PackageItem } from "@/lib/packages";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CardRail } from "@/components/ui/CardRail";
import { PackageCard } from "./PackageCard";

type PackageSectionProps = {
  title: string;
  description: string;
  packages: PackageItem[];
  eyebrow?: string;
};

export function PackageSection({
  title,
  description,
  packages,
  eyebrow,
}: PackageSectionProps) {
  if (!packages.length) return null;

  return (
    <section className="py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />
        <CardRail>
          {packages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </CardRail>
      </div>
    </section>
  );
}
