import { createMetadata } from "@/lib/seo";
import { SeasonalDealPage } from "@/components/packages/SeasonalDealPage";

export const metadata = createMetadata({
  title: "October Umrah Package from UK",
  description:
    "October Umrah Package from the UK with flights, visas, and walking-distance Haram hotels. ATOL protected.",
  path: "/october-umrah-package",
});

export default function Page() {
  return (
    <SeasonalDealPage
      title="October Umrah Package"
      pathLabel="October"
      description="Handcrafted October Umrah itineraries for UK pilgrims — flights included and ATOL protected."
    />
  );
}
