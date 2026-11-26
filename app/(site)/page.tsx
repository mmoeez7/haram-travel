import { createMetadata } from "@/lib/seo";
import { Hero } from "@/components/home/Hero";
import { FeaturedPackagesSection } from "@/components/home/FeaturedPackagesSection";
import { PackageMatcher } from "@/components/home/PackageMatcher";
import { WhyUs } from "@/components/home/WhyUs";
import { Steps } from "@/components/home/Steps";
import { SeoContent } from "@/components/content/SeoContent";
import { HOME_SEO_HTML } from "@/content/home-seo";
import { Testimonials } from "@/components/home/Testimonials";
import { VideoReviews } from "@/components/home/VideoReviews";
import { FAQ } from "@/components/home/FAQ";
import { BlogGuides } from "@/components/home/BlogGuides";

export const metadata = createMetadata({
  title: "Cheap Umrah Packages UK 2027 | Affordable Umrah Packages from UK",
  description:
    "Find cheap Umrah Packages and Cheap Umrah Packages UK 2027. Book your Affordable Umrah Package UK and Affordable Umrah Packages from UK for a budget-friendly pilgrimage.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedPackagesSection />
      <PackageMatcher />
      <WhyUs />
      <Steps />
      <SeoContent html={HOME_SEO_HTML} />
      <Testimonials limit={3} showSeeMore />
      <VideoReviews limit={4} showSeeMore />
      <FAQ />
      <BlogGuides />
    </>
  );
}
