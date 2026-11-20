import { createMetadata } from "@/lib/seo";
import { SeasonalDealPage } from "@/components/packages/SeasonalDealPage";
import { seasonPageDescription } from "@/lib/package-page-copy";

export const metadata = createMetadata({
  title: "September Umrah Package from UK",
  description:
    seasonPageDescription("september"),
  path: "/september-umrah-package",
});

export default function Page() {
  return (
    <SeasonalDealPage
      title="September Umrah Package"
      pathLabel="September"
      description={seasonPageDescription("september")}
      season="september"
    />
  );
}
