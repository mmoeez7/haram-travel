import { createMetadata } from "@/lib/seo";
import { StarPackagesPage } from "@/components/packages/StarPackagesPage";
import { starPageDescription } from "@/lib/package-page-copy";

export const metadata = createMetadata({
  title: "5 Star Umrah Packages from UK",
  description:
    starPageDescription(5),
  path: "/5-star-umrah-packages",
});

export default function Page() {
  return (
    <StarPackagesPage
      stars={5}
      pathLabel="5 Star"
      title="5 Star Umrah Packages"
      description={starPageDescription(5)}
    />
  );
}
