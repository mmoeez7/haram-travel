import { createMetadata } from "@/lib/seo";
import { SeasonalDealPage } from "@/components/packages/SeasonalDealPage";

export const metadata = createMetadata({
  title: "September Umrah Package from UK",
  description:
    "September Umrah Package from the UK with flights, visas, and walking-distance Haram hotels. ATOL protected.",
  path: "/september-umrah-package",
});

export default function Page() {
  return (
    <SeasonalDealPage
      title="September Umrah Package"
      pathLabel="September"
      description="Handcrafted September Umrah itineraries for UK pilgrims — flights included and ATOL protected."
    />
  );
}
