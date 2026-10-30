import { createMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { WhyUs } from "@/components/home/WhyUs";
import { Guarantees } from "@/components/about/Guarantees";
import { Credentials } from "@/components/about/Credentials";

export const metadata = createMetadata({
  title: "Why Us",
  description:
    "Why UK pilgrims choose Haram Travel — walking-distance hotels, ATOL protection, 0% installments, and 24/7 UK & Saudi care.",
  path: "/why-us",
});

export default function WhyUsPage() {
  return (
    <>
      <section className="bg-cream pt-12 pb-4">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Why Us" }]} />
          <h1 className="font-display text-4xl font-semibold uppercase tracking-wide text-charcoal md:text-5xl">
            Why UK Pilgrims Choose Us
          </h1>
          <p className="mt-4 max-w-2xl text-muted md:text-lg">
            We don&apos;t just sell packages — we guide your divine journey with honesty, transparency,
            and care from doorstep to Haram.
          </p>
        </div>
      </section>
      <WhyUs />
      <Guarantees />
      <Credentials />
    </>
  );
}
