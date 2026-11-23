import { createMetadata } from "@/lib/seo";
import { StarPackagesPage } from "@/components/packages/StarPackagesPage";
import { starPageDescription } from "@/lib/package-page-copy";

export const metadata = createMetadata({
  title: "3 Star Umrah Package UK 2027 | 3 Star Economy Umrah Packages UK 2027",
  description:
    "Book your 3 Star Umrah Package UK 2027 with ease! Explore affordable 3 Star Economy Umrah Packages and trusted 3 Star Economy Umrah Packages UK 2027 for a comfortable and budget-friendly pilgrimage with Haramtravel.",
  path: "/3-star-umrah-packages",
  absolute: true,
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
