import { createMetadata } from "@/lib/seo";
import { Hero } from "@/components/home/Hero";
import { FeaturedPackages } from "@/components/home/FeaturedPackages";
import { CustomQuote } from "@/components/home/CustomQuote";
import { WhyUs } from "@/components/home/WhyUs";
import { Steps } from "@/components/home/Steps";
import { Testimonials } from "@/components/home/Testimonials";
import { VideoReviews } from "@/components/home/VideoReviews";
import { FAQ } from "@/components/home/FAQ";
import { BlogGuides } from "@/components/home/BlogGuides";

export const metadata = createMetadata({
  title: "Hajj and Umrah Packages UK | Haram Travel",
  description:
    "All-inclusive bespoke UK Umrah packages from £745pp. Direct flights, walking-distance Haram hotels, visas & private transfers. ATOL protected.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedPackages />
      <CustomQuote />
      <WhyUs />
      <Steps />
      <Testimonials />
      <VideoReviews />
      <FAQ />
      <BlogGuides />
    </>
  );
}
