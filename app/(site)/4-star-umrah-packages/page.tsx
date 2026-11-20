import { createMetadata } from "@/lib/seo";
import { StarPackagesPage } from "@/components/packages/StarPackagesPage";
import { starPageDescription } from "@/lib/package-page-copy";

export const metadata = createMetadata({
  title: "4 Star Umrah Packages from UK",
  description:
    starPageDescription(4),
  path: "/4-star-umrah-packages",
});

export default function Page() {
  return (
    <StarPackagesPage
      stars={4}
      pathLabel="4 Star"
      title="4 Star Umrah Packages"
      description={starPageDescription(4)}
    />
  );
}
