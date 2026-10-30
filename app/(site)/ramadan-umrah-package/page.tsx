import { createMetadata } from "@/lib/seo";
import { SeasonalDealPage } from "@/components/packages/SeasonalDealPage";

export const metadata = createMetadata({
  title: "Ramadan Umrah Package from UK",
  description:
    "Ramadan Umrah Package from the UK with flights, visas, and walking-distance Haram hotels. ATOL protected.",
  path: "/ramadan-umrah-package",
});

export default function Page() {
  return (
    <SeasonalDealPage
      title="Ramadan Umrah Package"
      pathLabel="Ramadan"
      description="Handcrafted Ramadan Umrah itineraries for UK pilgrims — flights included and ATOL protected."
      season="ramadan"
    />
  );
}
