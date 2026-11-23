import { createMetadata } from "@/lib/seo";
import { StarPackagesPage } from "@/components/packages/StarPackagesPage";
import { starPageDescription } from "@/lib/package-page-copy";

export const metadata = createMetadata({
  title: "5 Star Umrah Packages UK 2027 | Premium Umrah Packages UK",
  description:
    "Explore 5 Star Umrah Packages UK and 5 Star Umrah Package 2027 UK for a luxury pilgrimage. Book Premium Umrah Packages and Premium Umrah Packages 2027 UK today with the Best company, Haram Travel UK.",
  path: "/5-star-umrah-packages",
  absolute: true,
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
