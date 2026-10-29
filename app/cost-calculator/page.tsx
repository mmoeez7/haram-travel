import { createMetadata } from "@/lib/seo";
import { SITE } from "@/lib/constants";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CostCalculator } from "@/components/calculator/CostCalculator";

export const metadata = createMetadata({
  title: "0% Cost Calculator",
  description:
    "Calculate your Umrah budget with 0% interest installments. Lock today's price with a low deposit and plan monthly payments.",
  path: "/cost-calculator",
});

export default function CostCalculatorPage() {
  return (
    <section className="bg-cream py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "0% Cost Calculator" }]} />
        <h1 className="font-display text-4xl font-semibold uppercase tracking-wide text-charcoal md:text-5xl">
          Instant Umrah Budget & Installment Calculator
        </h1>
        <p className="mt-4 max-w-2xl text-muted md:text-lg">
          0% interest Umrah payment plans. Lock today&apos;s price with a £{SITE.depositFrom}pp
          deposit and spread the balance before departure.
        </p>
        <CostCalculator />
      </div>
    </section>
  );
}
