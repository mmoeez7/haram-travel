import { createMetadata } from "@/lib/seo";
import { SeasonalDealPage } from "@/components/packages/SeasonalDealPage";

export const metadata = createMetadata({
  title: "Easter Umrah Package from UK",
  description:
    "Easter Umrah Package from the UK with flights, visas, and walking-distance Haram hotels. ATOL protected.",
  path: "/easter-umrah-package",
});

export default function Page() {
  return (
    <SeasonalDealPage
      title="Easter Umrah Package"
      pathLabel="Easter"
      description="Handcrafted Easter Umrah itineraries for UK pilgrims — flights included and ATOL protected."
      season="easter"
    />
  );
}
