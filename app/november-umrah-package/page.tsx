import { createMetadata } from "@/lib/seo";
import { SeasonalDealPage } from "@/components/packages/SeasonalDealPage";

export const metadata = createMetadata({
  title: "November Umrah Package from UK",
  description:
    "November Umrah Package from the UK with flights, visas, and walking-distance Haram hotels. ATOL protected.",
  path: "/november-umrah-package",
});

export default function Page() {
  return (
    <SeasonalDealPage
      title="November Umrah Package"
      pathLabel="November"
      description="Handcrafted November Umrah itineraries for UK pilgrims — flights included and ATOL protected."
    />
  );
}
