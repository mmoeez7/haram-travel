import { createMetadata } from "@/lib/seo";
import { ContactHero } from "@/components/contact/ContactHero";
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
    <>
      <ContactHero />

      <section className="bg-cream pb-12 md:pb-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <ContactCards />

          <div className="mt-12 grid gap-8 lg:grid-cols-[1.35fr_0.95fr] lg:items-start">
            <InquiryForm />
            <OfficeHours />
          </div>
        </div>
      </section>
    </>
  );
}
