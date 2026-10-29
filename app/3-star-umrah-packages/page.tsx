import { createMetadata } from "@/lib/seo";
import { StarPackagesPage } from "@/components/packages/StarPackagesPage";

export const metadata = createMetadata({
  title: "3 Star Umrah Packages from UK",
  description:
    "Affordable 3-star Umrah packages from the UK with flights, visas, and courtyard-friendly hotels.",
  path: "/3-star-umrah-packages",
});

export default function Page() {
  return (
    <StarPackagesPage
      stars={3}
      pathLabel="3 Star"
      title="3 Star Umrah Packages"
      description="Reliable economy comfort with flights included, courtyard-friendly hotels, and full visa support."
    />
  );
}
