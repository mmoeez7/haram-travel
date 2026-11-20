import { createMetadata } from "@/lib/seo";
import { SeasonalDealPage } from "@/components/packages/SeasonalDealPage";
import { seasonPageDescription } from "@/lib/package-page-copy";

export const metadata = createMetadata({
  title: "January Umrah Package from UK",
  description:
    seasonPageDescription("january"),
  path: "/january-umrah-package",
});

export default function Page() {
  return (
    <SeasonalDealPage
      title="January Umrah Package"
      pathLabel="January"
      description={seasonPageDescription("january")}
      season="january"
    />
  );
}
