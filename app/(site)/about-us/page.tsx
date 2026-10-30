import { createMetadata } from "@/lib/seo";
import { AboutHero } from "@/components/about/AboutHero";
import { Guarantees } from "@/components/about/Guarantees";
import { FoundingStory } from "@/components/about/FoundingStory";
import { Credentials } from "@/components/about/Credentials";

export const metadata = createMetadata({
  title: "About Us | Trusted Umrah & Hajj Experts",
  description:
    "Learn how Haram Travel guides British pilgrims with ATOL protection, walking-distance hotels, and honest courtyard guarantees.",
  path: "/about-us",
});

export default function AboutUsPage() {
  return (
    <>
      <AboutHero />
      <Guarantees />
      <FoundingStory />
      <Credentials />
    </>
  );
}
