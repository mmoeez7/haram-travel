import { createMetadata } from "@/lib/seo";
import { SeasonalDealPage } from "@/components/packages/SeasonalDealPage";

export const metadata = createMetadata({
  title: "January Umrah Package from UK",
  description:
    "January Umrah Package from the UK with flights, visas, and walking-distance Haram hotels. ATOL protected.",
  path: "/january-umrah-package",
});

export default function Page() {
  return (
    <SeasonalDealPage
      title="January Umrah Package"
      pathLabel="January"
      description="Handcrafted January Umrah itineraries for UK pilgrims — flights included and ATOL protected."
    />
  );
}
