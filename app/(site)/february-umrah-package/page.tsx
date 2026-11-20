import { createMetadata } from "@/lib/seo";
import { SeasonalDealPage } from "@/components/packages/SeasonalDealPage";
import { seasonPageDescription } from "@/lib/package-page-copy";

export const metadata = createMetadata({
  title: "February Umrah Package from UK",
  description:
    seasonPageDescription("february"),
  path: "/february-umrah-package",
});

export default function Page() {
  return (
    <SeasonalDealPage
      title="February Umrah Package"
      pathLabel="February"
      description={seasonPageDescription("february")}
      season="february"
    />
  );
}
