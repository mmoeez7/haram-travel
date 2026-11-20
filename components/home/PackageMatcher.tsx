"use client";

import Image from "next/image";
import { useEffect, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, X } from "lucide-react";
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

const TOTAL_STEPS = 5;

const STEP_LABELS = ["Season", "Airport", "Nights", "Stay", "Quote"] as const;

const chipBase =
  "group relative flex w-full items-center gap-3 overflow-hidden rounded-2xl border px-4 py-3.5 text-left text-sm font-semibold transition duration-200";
const chipIdle =
  "border-border/80 bg-white/80 text-ink shadow-sm hover:-translate-y-0.5 hover:border-gold/60 hover:bg-white hover:shadow-md";
const chipActive =
  "border-gold bg-gradient-to-r from-gold/20 via-gold-soft/30 to-white text-charcoal shadow-[0_8px_24px_rgba(212,175,55,0.25)] ring-1 ring-gold/40";

const SEASON_ICONS: Record<InquirySeason, string> = {
  winter: "/images/matcher/winter.png",
  ramadan: "/images/matcher/ramadan.png",
  spring: "/images/matcher/spring.png",
  flexible: "/images/matcher/annual.png",
};

const HOTEL_ICONS: Record<InquiryHotelTier, string> = {
  clock_tower_5: "/images/matcher/kaaba.png",
  footsteps_4: "/images/matcher/footsteps.png",
  shuttle_3: "/images/matcher/shuttle.png",
};

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

const STEP_COPY: Record<number, { title: string; helper: string }> = {
  1: {
    title: "When are you planning to travel?",
    helper: "Pick a season — you can refine dates with our advisors later.",
  },
  2: {
    title: "Where will you depart from?",
    helper: "Choose your preferred UK departure airport.",
  },
  3: {
    title: "How many nights do you need?",
    helper: "Select the trip length that suits your schedule.",
  },
  4: {
    title: "Hotel preference & party size",
    helper: "Choose your hotel style and how many pilgrims are travelling.",
  },
  5: {
    title: "Send your custom quote request",
    helper: "Leave your details — UK advisors will match packages for you.",
  },
};

function ChipIcon({ src, alt }: { src: string; alt: string }) {
  return (
    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cream-dark/80">
      <Image
        src={src}
        alt={alt}
        width={28}
        height={28}
        className="h-7 w-7 object-contain"
      />
    </span>
  );
}

function ChipButton({
  active,
  children,
  onClick,
  iconSrc,
  iconAlt,
  centered = false,
}: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
  iconSrc?: string;
  iconAlt?: string;
  centered?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${chipBase} ${active ? chipActive : chipIdle} ${
        centered ? "justify-center text-center" : ""
      }`}
      aria-pressed={active}
    >
      {iconSrc ? <ChipIcon src={iconSrc} alt={iconAlt || ""} /> : null}
      <span className={`min-w-0 ${centered ? "" : "flex-1"}`}>{children}</span>
      {active ? (
        <span
          className="pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-full bg-gold/20 blur-xl"
          aria-hidden
        />
      ) : null}
    </button>
  );
}

function StepRail({
  step,
  onJump,
}: {
  step: number;
  onJump: (target: number) => void;
}) {
  return (
    <ol className="flex items-center justify-between gap-1 sm:gap-2">
      {STEP_LABELS.map((label, index) => {
        const n = index + 1;
        const done = n < step;
        const current = n === step;
        const canJump = n < step;

        return (
          <li key={label} className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
            <button
              type="button"
              disabled={!canJump}
              onClick={() => canJump && onJump(n)}
              className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold transition sm:h-10 sm:w-10 sm:text-sm ${
                current
                  ? "bg-gold text-charcoal shadow-[0_0_0_4px_rgba(212,175,55,0.25)]"
                  : done
                    ? "bg-charcoal text-gold-soft hover:scale-105"
                    : "bg-cream-dark text-muted"
              } ${canJump ? "cursor-pointer" : "cursor-default"}`}
              aria-current={current ? "step" : undefined}
              aria-label={`${label}, step ${n}`}
            >
              {n}
            </button>
            <span
              className={`max-w-full truncate text-[10px] font-semibold uppercase tracking-wide sm:text-[11px] ${
                current ? "text-gold-dark" : done ? "text-charcoal" : "text-muted"
              }`}
            >
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function greetingName(fullName: string) {
  const trimmed = fullName.trim();
  if (!trimmed) return "there";
  return trimmed.split(/\s+/)[0] || trimmed;
}

export function PackageMatcher() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successName, setSuccessName] = useState("");

  const copy = STEP_COPY[step]!;
  const canContinueHotelParty = Boolean(form.hotelTier && form.passengers);

  function closeSuccess() {
    setSuccessOpen(false);
  }

  useEffect(() => {
    if (!successOpen) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setSuccessOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [successOpen]);

  function goNext() {
    setStep((current) => Math.min(TOTAL_STEPS, current + 1));
  }

  function goBack() {
    setStep((current) => Math.max(1, current - 1));
  }

  function selectAndAdvance(patch: Partial<FormState>, advance = true) {
    setForm((prev) => ({ ...prev, ...patch }));
    if (advance) {
      setStep((current) => Math.min(TOTAL_STEPS, current + 1));
    }
  }

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

    const submittedName = form.name.trim();
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
          name: submittedName,
          phone: form.phone.trim(),
          email: form.email.trim(),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        throw new Error(data.error || "Could not submit inquiry");
      }
      setSuccessName(submittedName);
      setSuccessOpen(true);
      setForm(initialForm);
      setStep(1);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not submit inquiry");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section
      id="package-matcher"
      className="relative scroll-mt-24 overflow-hidden bg-cream py-12 md:py-16"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(212,175,55,0.18),_transparent_55%),radial-gradient(ellipse_at_bottom_right,_rgba(26,60,52,0.08),_transparent_45%)]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
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
            className="relative mx-auto mt-8 flex h-[38rem] w-full max-w-xl flex-col overflow-hidden rounded-[1.75rem] border border-gold/25 bg-gradient-to-b from-[#fffdf8] via-white to-cream/40 p-4 shadow-[0_20px_60px_rgba(26,26,26,0.1)] sm:h-[40rem] sm:p-6 md:mt-10 md:max-w-2xl"
          >
            <span
              className="pointer-events-none absolute -right-2 top-16 select-none font-display text-[7.5rem] font-semibold leading-none text-gold/[0.07] sm:top-12 sm:text-[9rem]"
              aria-hidden
            >
              {step}
            </span>

            <div className="relative mb-6 shrink-0 sm:mb-7">
              <StepRail step={step} onJump={setStep} />
            </div>

            <div className="relative mb-5 shrink-0 sm:mb-6">
              <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-gold-dark">
                Step {step} · {STEP_LABELS[step - 1]}
              </p>
              <h3 className="font-display text-[1.35rem] font-semibold leading-snug text-charcoal sm:text-2xl">
                {copy.title}
              </h3>
              <p className="mt-2 min-h-[2.5rem] text-sm leading-relaxed text-muted">
                {copy.helper}
              </p>
            </div>

            <div className="relative min-h-0 flex-1 overflow-y-auto pr-0.5">
              {step === 1 ? (
                <div className="flex flex-col gap-3">
                  {INQUIRY_SEASONS.map((option) => (
                    <ChipButton
                      key={option.value}
                      active={form.season === option.value}
                      onClick={() => selectAndAdvance({ season: option.value })}
                      iconSrc={SEASON_ICONS[option.value]}
                      iconAlt={resolveSeasonOptionLabel(option)}
                    >
                      {resolveSeasonOptionLabel(option)}
                    </ChipButton>
                  ))}
                </div>
              ) : null}

              {step === 2 ? (
                <div className="flex flex-col gap-3">
                  {INQUIRY_DEPARTURES.map((option) => (
                    <ChipButton
                      key={option.value}
                      active={form.departure === option.value}
                      onClick={() =>
                        selectAndAdvance({ departure: option.value })
                      }
                    >
                      {option.label}
                    </ChipButton>
                  ))}
                </div>
              ) : null}

              {step === 3 ? (
                <div className="grid grid-cols-2 gap-3">
                  {INQUIRY_NIGHTS.map((nights) => (
                    <ChipButton
                      key={nights}
                      active={form.nights === nights}
                      onClick={() => selectAndAdvance({ nights })}
                      centered
                    >
                      {nights} Nights
                    </ChipButton>
                  ))}
                </div>
              ) : null}

              {step === 4 ? (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-3">
                    {INQUIRY_HOTEL_TIERS.map((option) => (
                      <ChipButton
                        key={option.value}
                        active={form.hotelTier === option.value}
                        onClick={() =>
                          selectAndAdvance({ hotelTier: option.value }, false)
                        }
                        iconSrc={HOTEL_ICONS[option.value]}
                        iconAlt={option.label}
                      >
                        {option.label}
                      </ChipButton>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {INQUIRY_PASSENGERS.map((option) => (
                      <ChipButton
                        key={option.value}
                        active={form.passengers === option.value}
                        onClick={() =>
                          selectAndAdvance({ passengers: option.value }, false)
                        }
                        centered
                      >
                        {option.label}
                      </ChipButton>
                    ))}
                  </div>
                  <Button
                    type="button"
                    variant="swipe"
                    className="mt-1 w-full !rounded-full py-3.5"
                    disabled={!canContinueHotelParty}
                    onClick={goNext}
                  >
                    Continue
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Button>
                </div>
              ) : null}

              {step === 5 ? (
                <div className="flex flex-col gap-3">
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
                      className="h-12 w-full rounded-2xl border border-border bg-white px-4 text-sm text-ink outline-none ring-gold transition focus:ring-2"
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
                      className="h-12 w-full rounded-2xl border border-border bg-white px-4 text-sm text-ink outline-none ring-gold transition focus:ring-2"
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
                      className="h-12 w-full rounded-2xl border border-border bg-white px-4 text-sm text-ink outline-none ring-gold transition focus:ring-2"
                    />
                  </label>
                  <Button
                    type="submit"
                    variant="swipe"
                    className="mt-1 w-full !rounded-full py-3.5"
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
                </div>
              ) : null}
            </div>

            <div className="relative mt-auto flex shrink-0 items-center justify-between gap-3 pt-6">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={goBack}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3.5 py-2 text-xs font-semibold text-charcoal transition hover:border-gold hover:text-gold-dark"
                >
                  <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
                  Back
                </button>
              ) : (
                <span className="text-[11px] text-muted">About 60 seconds</span>
              )}
              <span className="rounded-full bg-cream-dark px-3 py-1.5 text-[11px] font-semibold text-charcoal">
                {step} / {TOTAL_STEPS}
              </span>
            </div>
          </form>
        </Reveal>
      </div>

      {successOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/50 p-4 backdrop-blur-[2px]"
          onClick={closeSuccess}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="matcher-success-title"
            className="relative w-full max-w-md rounded-3xl border border-gold/30 bg-gradient-to-b from-[#fffdf8] to-white p-6 shadow-[0_24px_70px_rgba(26,26,26,0.25)] sm:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeSuccess}
              className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full text-muted transition hover:bg-cream-dark hover:text-charcoal"
              aria-label="Close"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>

            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 text-gold-dark">
              <CheckCircle2 className="h-8 w-8" aria-hidden />
            </div>

            <h3
              id="matcher-success-title"
              className="text-center font-display text-2xl font-semibold text-charcoal"
            >
              Thank you, {greetingName(successName)}
            </h3>
            <p className="mt-3 text-center text-sm leading-relaxed text-muted">
              Your details have been sent to our customer support team. An advisor
              will get in touch with you shortly.
            </p>
            {successName ? (
              <p className="mt-4 rounded-2xl bg-cream-dark/70 px-4 py-3 text-center text-sm text-charcoal">
                Request submitted for{" "}
                <span className="font-semibold">{successName}</span>
              </p>
            ) : null}

            <Button
              type="button"
              variant="swipe"
              className="mt-6 w-full !rounded-full py-3"
              onClick={closeSuccess}
            >
              Close
            </Button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
