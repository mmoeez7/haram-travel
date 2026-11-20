import { createMetadata } from "@/lib/seo";
import { SeasonalDealPage } from "@/components/packages/SeasonalDealPage";
import { seasonPageDescription } from "@/lib/package-page-copy";

export const metadata = createMetadata({
  title: "October Umrah Package from UK",
  description:
    seasonPageDescription("october"),
  path: "/october-umrah-package",
});

export default function Page() {
  return (
    <SeasonalDealPage
      title="October Umrah Package"
      pathLabel="October"
      description={seasonPageDescription("october")}
      season="october"
    />
  );
}
