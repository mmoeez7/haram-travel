import { createMetadata } from "@/lib/seo";
import { SeasonalDealPage } from "@/components/packages/SeasonalDealPage";
import { seasonPageDescription } from "@/lib/package-page-copy";

export const metadata = createMetadata({
  title: "December Umrah Package from UK",
  description:
    seasonPageDescription("december"),
  path: "/december-umrah-package",
});

export default function Page() {
  return (
    <SeasonalDealPage
      title="December Umrah Package"
      pathLabel="December"
      description={seasonPageDescription("december")}
      season="december"
    />
  );
}
