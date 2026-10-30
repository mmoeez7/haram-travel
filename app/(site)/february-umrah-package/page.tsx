import { createMetadata } from "@/lib/seo";
import { SeasonalDealPage } from "@/components/packages/SeasonalDealPage";

export const metadata = createMetadata({
  title: "February Umrah Package from UK",
  description:
    "February Umrah Package from the UK with flights, visas, and walking-distance Haram hotels. ATOL protected.",
  path: "/february-umrah-package",
});

export default function Page() {
  return (
    <SeasonalDealPage
      title="February Umrah Package"
      pathLabel="February"
      description="Handcrafted February Umrah itineraries for UK pilgrims — flights included and ATOL protected."
    />
  );
}
