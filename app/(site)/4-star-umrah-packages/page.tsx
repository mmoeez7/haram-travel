import { createMetadata } from "@/lib/seo";
import { StarPackagesPage } from "@/components/packages/StarPackagesPage";

export const metadata = createMetadata({
  title: "4 Star Umrah Packages from UK",
  description:
    "Executive 4-star Umrah packages from the UK with elevated hotels closer to the Haram.",
  path: "/4-star-umrah-packages",
});

export default function Page() {
  return (
    <StarPackagesPage
      stars={4}
      pathLabel="4 Star"
      title="4 Star Umrah Packages"
      description="Executive hotels closer to the Haram with elevated dining and family configurations."
    />
  );
}
