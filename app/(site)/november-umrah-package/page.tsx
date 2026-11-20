import { createMetadata } from "@/lib/seo";
import { SeasonalDealPage } from "@/components/packages/SeasonalDealPage";
import { seasonPageDescription } from "@/lib/package-page-copy";

export const metadata = createMetadata({
  title: "November Umrah Package from UK",
  description:
    seasonPageDescription("november"),
  path: "/november-umrah-package",
});

export default function Page() {
  return (
    <SeasonalDealPage
      title="November Umrah Package"
      pathLabel="November"
      description={seasonPageDescription("november")}
      season="november"
    />
  );
}
