import { SITE } from "@/lib/constants";

export const privacySections = [
  {
    id: "scope",
    title: "Scope of Operations & Purpose",
    body: `${SITE.legalName} operates as an arranging travel agency coordinating flight arrangements, Haramain accommodations, and visas for UK pilgrims. This policy explains how we collect, use, and protect customer data submitted through our website, WhatsApp, and booking forms.`,
  },
  {
    id: "information",
    title: "Information You Voluntarily Provide",
    body: "We collect contact details (full name, phone, email), travel preferences (dates, airport, hotel category, party size), passenger bio-data required for visas (passport copies, date of birth, nationality), and special requests such as mobility assistance or dietary needs.",
  },
  {
    id: "accuracy",
    title: "Customer Responsibility & Accuracy of Information",
    body: "The lead passenger is responsible for ensuring all submitted passenger details — names, dates of birth, and passport numbers — are accurate and match official travel documents. Incorrect information may delay visas or tickets.",
  },
  {
    id: "third-party",
    title: "Third-Party Suppliers & Limitation for External Actions",
    body: "We act as an arranging travel agency and are not liable for independent actions of airlines, hotels, or government visa platforms including the Ministry of Hajj and Umrah / Nusuk systems.",
  },
  {
    id: "consent",
    title: "Communication & Direct WhatsApp / Phone Consent",
    body: "By submitting an inquiry, you consent to be contacted via WhatsApp, SMS, phone, and email regarding quotes, itineraries, document requests, and booking updates.",
  },
  {
    id: "liability",
    title: "Limitation of Liability & Digital Transmission",
    body: `${SITE.legalName} disclaims liability for unauthorised access, cyber interruptions, or data transmission issues beyond reasonable security measures applied to our systems and trusted processors.`,
  },
  {
    id: "payments",
    title: "Payments & Financial Transactions",
    body: "We do not store credit or debit card numbers on our servers. Payments are processed via authorised merchant payment gateways or bank transfers. Flight-inclusive packages remain subject to ATOL protection where applicable.",
  },
  {
    id: "updates",
    title: "Right to Update & Amend This Policy",
    body: "We reserve the right to modify this policy at any time. Updated versions will be published on this page with a revised effective date.",
  },
  {
    id: "governing",
    title: "Governing Law, Informal Resolution & Contact",
    body: `This policy is governed by the laws of England and Wales. For privacy queries contact ${SITE.legalName} at ${SITE.email}, ${SITE.phone}, or ${SITE.address}.`,
  },
];

export function PrivacyContent() {
  return (
    <div className="space-y-8">
      {privacySections.map((section, index) => (
        <section
          key={section.id}
          id={section.id}
          className="scroll-mt-28 rounded-2xl border border-border bg-white p-6 md:p-8"
        >
          <h2 className="font-display text-xl font-semibold uppercase tracking-wide text-charcoal md:text-2xl">
            {index + 1}. {section.title}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted md:text-base">{section.body}</p>
        </section>
      ))}
    </div>
  );
}
