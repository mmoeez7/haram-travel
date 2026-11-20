import { createMetadata } from "@/lib/seo";
import { SeasonalDealPage } from "@/components/packages/SeasonalDealPage";
import { seasonPageDescription } from "@/lib/package-page-copy";

export const metadata = createMetadata({
  title: "Ramadan Umrah Package from UK",
  description:
    seasonPageDescription("ramadan"),
  path: "/ramadan-umrah-package",
});

export default function Page() {
  return (
    <SeasonalDealPage
      title="Ramadan Umrah Package"
      pathLabel="Ramadan"
      description={seasonPageDescription("ramadan")}
      season="ramadan"
    />
  );
}
