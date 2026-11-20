import { createMetadata } from "@/lib/seo";
import { SeasonalDealPage } from "@/components/packages/SeasonalDealPage";
import { seasonPageDescription } from "@/lib/package-page-copy";

export const metadata = createMetadata({
  title: "Easter Umrah Package from UK",
  description:
    seasonPageDescription("easter"),
  path: "/easter-umrah-package",
});

export default function Page() {
  return (
    <SeasonalDealPage
      title="Easter Umrah Package"
      pathLabel="Easter"
      description={seasonPageDescription("easter")}
      season="easter"
    />
  );
}
