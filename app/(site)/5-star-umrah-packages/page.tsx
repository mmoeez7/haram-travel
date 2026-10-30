import { createMetadata } from "@/lib/seo";
import { StarPackagesPage } from "@/components/packages/StarPackagesPage";

export const metadata = createMetadata({
  title: "5 Star Umrah Packages from UK",
  description:
    "VIP 5-star Umrah packages from the UK including Clock Tower and courtyard luxury stays.",
  path: "/5-star-umrah-packages",
});

export default function Page() {
  return (
    <StarPackagesPage
      stars={5}
      pathLabel="5 Star"
      title="5 Star Umrah Packages"
      description="Clock Tower and courtyard VIP stays with white-glove UK & Saudi support."
    />
  );
}
