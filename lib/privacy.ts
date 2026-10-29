import { SITE } from "./constants";

export type PrivacyBullet = {
  label?: string;
  text: string;
};

export type PrivacyCallout = {
  title: string;
  body: string;
};

export type PrivacyContactItem = {
  label: string;
  value: string;
};

export type PrivacySection = {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: PrivacyBullet[];
  closingParagraphs?: string[];
  callout?: PrivacyCallout;
  contactBox?: {
    title: string;
    items: PrivacyContactItem[];
  };
};

/** Structured privacy policy content — ready to swap for API response later. */
export const privacySections: PrivacySection[] = [
  {
    id: "scope",
    title: "Scope of Operations & Purpose",
    paragraphs: [
      `This Privacy and Customer Data Policy explains how **${SITE.legalName}** ("we", "our", "us") collects, utilizes, and manages information provided by customers, visitors, and pilgrims accessing our website, making inquiries, or requesting travel itineraries.`,
      "We operate as an organizing travel intermediary coordinating flight arrangements, handpicked Haramain accommodations, Saudi entry visa submissions, and local transportation. Information provided by users is handled strictly for legitimate commercial and travel coordination purposes.",
    ],
  },
  {
    id: "information",
    title: "Information You Voluntarily Provide",
    paragraphs: [
      "We only collect information that you voluntarily submit to us via our online inquiry forms, WhatsApp conversations, telephone calls, or email communications. This may include:",
    ],
    bullets: [
      {
        label: "Contact Details",
        text: "Full name, telephone/mobile number, WhatsApp number, and email address.",
      },
      {
        label: "Travel Preferences",
        text: "Preferred travel dates, UK departure airport, hotel preferences, party size, and room configuration requests.",
      },
      {
        label: "Passenger Bio-Data (Upon Booking)",
        text: "Passport copies, dates of birth, and nationality necessary solely to apply for official Saudi eVisas and issue confirmed airline tickets.",
      },
      {
        label: "Special Requests",
        text: "Information you choose to share regarding mobility assistance, wheelchair needs, or dietary preferences.",
      },
    ],
  },
  {
    id: "accuracy",
    title: "Customer Responsibility & Accuracy of Information",
    paragraphs: [
      "The customer or lead passenger is solely and exclusively responsible for ensuring that all names, dates of birth, passport numbers, spelling, and travel requirements submitted to us are accurate, truthful, and completely match the official passport documents of all traveling passengers.",
    ],
    callout: {
      title: "Customer Accuracy Warranty",
      body: `${SITE.legalName} shall not be held liable or responsible for any flight check-in refusals, airline re-ticketing charges, flight cancellations, Saudi visa delays, or border control entry rejections resulting from incorrect, incomplete, or delayed information supplied by the customer. Any penalties or administrative amendment fees imposed by airlines or government platforms due to client error remain the sole liability of the customer.`,
    },
  },
  {
    id: "third-party",
    title: "Third-Party Suppliers & Limitation for External Actions",
    paragraphs: [
      "To fulfill your pilgrimage itinerary, passenger information is necessarily shared with independent third-party travel providers including contracted airlines, hotel management systems in Makkah and Madinah, private transfer chauffeurs, and official visa issuance platforms (e.g. Ministry of Foreign Affairs / Nusuk).",
      "Customers explicitly recognize and agree that these third-party organizations operate independently.",
    ],
    callout: {
      title: "Third-Party Disclaimer",
      body: `${SITE.legalName} acts as an arranging travel agency and cannot be held liable for independent actions, flight schedule amendments, technical portal downtimes, mechanical delays, visa rejections or processing delays by Saudi government authorities, or hotel room reassignments executed by third-party suppliers beyond our direct operational control.`,
    },
  },
  {
    id: "consent",
    title: "Communication & Direct WhatsApp / Phone Consent",
    paragraphs: [
      "By submitting an inquiry, entering your mobile number, or initiating contact with us on WhatsApp, website forms, or telephone, you provide your express consent for our travel advisors to contact you via:",
    ],
    bullets: [
      {
        text: "WhatsApp messages and voice notes containing customized quotes and hotel comparisons.",
      },
      {
        text: "Direct telephone calls to discuss your family's travel requirements.",
      },
      {
        text: "Email updates regarding itinerary schedules, travel advisories, and seasonal Umrah offers.",
      },
    ],
    closingParagraphs: [
      'We do not sell, rent, or lease your personal data to external marketing brokers. If at any time you wish to stop receiving promotional communications, you may simply reply "STOP" or inform our team on WhatsApp or email, and your preferences will be updated immediately.',
    ],
  },
  {
    id: "liability",
    title: "Limitation of Liability & Digital Transmission",
    paragraphs: [
      "While we take reasonable commercial precautions to protect the security and integrity of information transmitted through our website and digital systems, no data transmission over the internet can be guaranteed as 100% impenetrable.",
      `To the maximum extent permitted by applicable law, ${SITE.legalName} disclaims any liability for unauthorized access, cyber interruptions, malware, data interception, or events of Force Majeure that occur beyond our reasonable technical control.`,
    ],
  },
  {
    id: "payments",
    title: "Payments & Financial Transactions",
    paragraphs: [
      "We do not store or record full credit or debit card numbers on our website servers. Payments and deposit transactions are handled via authorized merchant payment gateways or direct verified bank transfers.",
      "We are not responsible for any banking fees, foreign exchange charges, or merchant gateway technical failures imposed by your issuing bank or card provider.",
    ],
  },
  {
    id: "updates",
    title: "Right to Update & Amend This Policy",
    paragraphs: [
      "We reserve the unilateral right to update, amend, or modify this Policy at any time to reflect operational, legal, or commercial changes. Any updates take effect immediately upon being posted on this website.",
      "Your continued interaction with our website, submission of inquiry details, or confirmation of travel arrangements following any update constitutes full acceptance of the revised terms.",
    ],
  },
  {
    id: "governing",
    title: "Governing Law, Informal Resolution & Contact",
    paragraphs: [
      "This policy, and any dispute or claim arising out of or in connection with it, shall be governed by and construed in accordance with the laws of England and Wales. Both parties agree that in the event of any query or misunderstanding, informal good-faith discussion shall be pursued first to achieve an amicable outcome.",
    ],
    contactBox: {
      title: "Agency Contact Information",
      items: [
        { label: "Trading Entity", value: SITE.legalName },
        { label: "Email", value: SITE.email },
        { label: "UK Helpline", value: SITE.phone },
        {
          label: "Office Address",
          value: `${SITE.address}, United Kingdom`,
        },
      ],
    },
  },
];
