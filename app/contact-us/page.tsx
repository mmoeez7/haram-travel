import { createMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ContactCards } from "@/components/contact/ContactCards";
import { InquiryForm } from "@/components/contact/InquiryForm";
import { OfficeHours } from "@/components/contact/OfficeHours";

export const metadata = createMetadata({
  title: "Contact Us | Haram Travel UK – Umrah & Hajj Experts",
  description:
    "Speak directly to a British Umrah specialist. WhatsApp concierge, UK helpline, and London office for tailored Hajj & Umrah inquiries.",
  path: "/contact-us",
});

export default function ContactUsPage() {
  return (
    <section className="bg-cream py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact Us" }]} />
        <h1 className="max-w-3xl font-display text-4xl font-semibold uppercase tracking-wide text-charcoal md:text-5xl">
          Speak Directly to a British Umrah Specialist.
        </h1>
        <p className="mt-4 max-w-2xl text-muted md:text-lg">
          Whether you are planning your first Umrah, organising a family trip with elderly parents,
          or looking for 5-star Clock Tower suites — our London-based team is ready to guide you.
        </p>

        <div className="mt-10">
          <ContactCards />
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
          <InquiryForm />
          <OfficeHours />
        </div>
      </div>
    </section>
  );
}
