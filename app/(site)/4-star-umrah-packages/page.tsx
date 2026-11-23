import { createMetadata } from "@/lib/seo";
import { StarPackagesPage } from "@/components/packages/StarPackagesPage";
import { starPageDescription } from "@/lib/package-page-copy";

export const metadata = createMetadata({
  title: "4 Star Umrah Package UK 2027 | 4 Star Deluxe Umrah Packages",
  description:
    "Discover the best 4 Star Umrah Package UK and 4 Star Umrah Packages UK 2027. Book your 4 Star Deluxe Umrah Package and 4 Star Deluxe Umrah Package 2027 for a comfortable pilgrimage.",
  path: "/4-star-umrah-packages",
  absolute: true,
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
