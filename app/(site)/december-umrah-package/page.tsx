import { createMetadata } from "@/lib/seo";
import { SeasonalDealPage } from "@/components/packages/SeasonalDealPage";

export const metadata = createMetadata({
  title: "December Umrah Package from UK",
  description:
    "December Umrah Package from the UK with flights, visas, and walking-distance Haram hotels. ATOL protected.",
  path: "/december-umrah-package",
});

export default function Page() {
  return (
    <SeasonalDealPage
      title="December Umrah Package"
      pathLabel="December"
      description="Handcrafted December Umrah itineraries for UK pilgrims — flights included and ATOL protected."
      season="december"
    />
  );
}
