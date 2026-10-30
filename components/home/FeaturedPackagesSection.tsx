import { getUmrahByStars } from "@/lib/packages";
import { FeaturedPackages } from "@/components/home/FeaturedPackages";

export async function FeaturedPackagesSection() {
  const [threeStar, fourStar, fiveStar] = await Promise.all([
    getUmrahByStars(3),
    getUmrahByStars(4),
    getUmrahByStars(5),
  ]);

  return (
    <FeaturedPackages threeStar={threeStar} fourStar={fourStar} fiveStar={fiveStar} />
  );
}
