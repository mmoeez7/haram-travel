import type { PackageItem } from "@/lib/packages";
import { PackageSection } from "@/components/packages/PackageSection";

const STAR_GROUPS = [
  {
    stars: 3 as const,
    title: "3 Star Packages",
    description: "Reliable economy comfort with flights included and courtyard-friendly hotels.",
  },
  {
    stars: 4 as const,
    title: "4 Star Packages",
    description: "Executive hotels closer to the Haram with elevated comfort for families.",
  },
  {
    stars: 5 as const,
    title: "5 Star Packages",
    description: "Premium VIP stays with the closest courtyard access and refined service.",
  },
];

export function StarGroupedPackages({
  packages,
  eyebrow,
}: {
  packages: PackageItem[];
  eyebrow?: string;
}) {
  if (!packages.length) return null;

  return (
    <>
      {STAR_GROUPS.map((group) => {
        const groupPackages = packages.filter((pkg) => pkg.stars === group.stars);
        if (!groupPackages.length) return null;

        return (
          <PackageSection
            key={group.stars}
            eyebrow={eyebrow}
            title={group.title}
            description={group.description}
            packages={groupPackages}
          />
        );
      })}
    </>
  );
}
