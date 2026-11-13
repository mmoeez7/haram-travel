"use client";

import { useState, type ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import {
  INQUIRY_DEPARTURES,
  INQUIRY_HOTEL_TIERS,
  INQUIRY_NIGHTS,
  INQUIRY_PASSENGERS,
  INQUIRY_SEASONS,
  resolveSeasonOptionLabel,
  type InquiryDeparture,
  type InquiryHotelTier,
  type InquiryPassengers,
  type InquirySeason,
} from "@/lib/package-inquiry";

const chipBase =
  "w-full rounded-full border px-3 py-2.5 text-left text-sm font-medium transition";
const chipIdle =
  "border-border bg-white text-ink hover:border-gold/50 hover:bg-cream";
const chipActive = "border-gold bg-gold/15 text-charcoal shadow-sm";

type FormState = {
  season: InquirySeason | "";
  departure: InquiryDeparture | "";
  nights: number | "";
  hotelTier: InquiryHotelTier | "";
  passengers: InquiryPassengers | "";
  name: string;
  phone: string;
  email: string;
};

const initialForm: FormState = {
  season: "",
  departure: "",
  nights: "",
  hotelTier: "",
  passengers: "",
  name: "",
  phone: "",
  email: "",
};

function ChipButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${chipBase} ${active ? chipActive : chipIdle}`}
      aria-pressed={active}
    >
      {children}
    </button>
  );
}

function Column({
  step,
  title,
  children,
}: {
  step: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-border/70 pb-5 last:border-b-0 last:pb-0 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-5 lg:last:border-r-0 lg:last:pr-0">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gold-dark">
          {step}. {title}
        </p>
      </div>
      <div className="flex flex-1 flex-col gap-2">{children}</div>
    </div>
  );
}

export function PackageMatcher() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (
      !form.season ||
      !form.departure ||
      !form.nights ||
      !form.hotelTier ||
      !form.passengers
    ) {
      toast.error("Please select season, departure, nights, hotel and party.");
      return;
    }
    if (!form.name.trim() || !form.phone.trim() || !form.email.trim()) {
      toast.error("Please enter your name, WhatsApp and email.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          season: form.season,
          departure: form.departure,
          nights: form.nights,
          hotelTier: form.hotelTier,
          passengers: form.passengers,
          name: form.name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        throw new Error(data.error || "Could not submit inquiry");
      }
      toast.success("Thanks — our advisors will match packages for you shortly.");
      setForm(initialForm);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not submit inquiry");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="package-matcher" className="scroll-mt-24 bg-cream-dark py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Bespoke Pilgrimage Matcher"
            title="Find Your Perfect Umrah Package"
            description="Tell us your season, departure and hotel preference — UK Umrah advisors will verify options and send a custom quote."
          />
        </Reveal>

        <Reveal delay={100}>
          <form
            onSubmit={onSubmit}
            className="mt-8 rounded-2xl border border-border bg-white p-4 shadow-sm sm:p-6 md:mt-10 md:p-8"
          >
            <div className="grid gap-5 lg:grid-cols-4 lg:gap-6">
              <Column step={1} title="Travel Season">
                {INQUIRY_SEASONS.map((option) => (
                  <ChipButton
                    key={option.value}
                    active={form.season === option.value}
                    onClick={() =>
                      setForm((prev) => ({ ...prev, season: option.value }))
                    }
                  >
                    {resolveSeasonOptionLabel(option)}
                  </ChipButton>
                ))}
              </Column>

              <Column step={2} title="Departure & Nights">
                {INQUIRY_DEPARTURES.map((option) => (
                  <ChipButton
                    key={option.value}
                    active={form.departure === option.value}
                    onClick={() =>
                      setForm((prev) => ({ ...prev, departure: option.value }))
                    }
                  >
                    {option.label}
                  </ChipButton>
                ))}
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {INQUIRY_NIGHTS.map((nights) => (
                    <ChipButton
                      key={nights}
                      active={form.nights === nights}
                      onClick={() => setForm((prev) => ({ ...prev, nights }))}
                    >
                      {nights} Nights
                    </ChipButton>
                  ))}
                </div>
              </Column>

              <Column step={3} title="Hotel & Party">
                {INQUIRY_HOTEL_TIERS.map((option) => (
                  <ChipButton
                    key={option.value}
                    active={form.hotelTier === option.value}
                    onClick={() =>
                      setForm((prev) => ({ ...prev, hotelTier: option.value }))
                    }
                  >
                    {option.label}
                  </ChipButton>
                ))}
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {INQUIRY_PASSENGERS.map((option) => (
                    <ChipButton
                      key={option.value}
                      active={form.passengers === option.value}
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          passengers: option.value,
                        }))
                      }
                    >
                      {option.label}
                    </ChipButton>
                  ))}
                </div>
              </Column>

              <Column step={4} title="Send Custom Quote">
                <label className="block">
                  <span className="sr-only">Your name</span>
                  <input
                    type="text"
                    name="name"
                    autoComplete="name"
                    placeholder="Your Name"
                    value={form.name}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="h-11 w-full rounded-xl border border-border bg-cream/40 px-3.5 text-sm text-ink outline-none ring-gold transition focus:ring-2"
                  />
                </label>
                <label className="block">
                  <span className="sr-only">UK WhatsApp</span>
                  <input
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    placeholder="UK WhatsApp (07xxx)"
                    value={form.phone}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, phone: e.target.value }))
                    }
                    className="h-11 w-full rounded-xl border border-border bg-cream/40 px-3.5 text-sm text-ink outline-none ring-gold transition focus:ring-2"
                  />
                </label>
                <label className="block">
                  <span className="sr-only">Email address</span>
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="Email Address"
                    value={form.email}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, email: e.target.value }))
                    }
                    className="h-11 w-full rounded-xl border border-border bg-cream/40 px-3.5 text-sm text-ink outline-none ring-gold transition focus:ring-2"
                  />
                </label>
                <Button
                  type="submit"
                  variant="gold"
                  className="mt-1 w-full !rounded-full py-3"
                  disabled={submitting}
                >
                  {submitting ? "Sending…" : "Match Packages"}
                  {!submitting ? (
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  ) : null}
                </Button>
                <p className="text-center text-[11px] text-muted">
                  Live advisor follow-up. Zero spam.
                </p>
              </Column>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
