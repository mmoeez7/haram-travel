import { createMetadata } from "@/lib/seo";
import { StarPackagesPage } from "@/components/packages/StarPackagesPage";
import { starPageDescription } from "@/lib/package-page-copy";

export const metadata = createMetadata({
  title: "3 Star Umrah Packages from UK",
  description:
    starPageDescription(3),
  path: "/3-star-umrah-packages",
});

export default function Page() {
  return (
    <StarPackagesPage
      stars={3}
      pathLabel="3 Star"
      title="3 Star Umrah Packages"
      description={starPageDescription(3)}
    />
  );
}
