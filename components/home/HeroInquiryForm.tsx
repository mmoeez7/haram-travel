"use client";

import { useId, useState, type ReactNode } from "react";
import { ArrowRight, ChevronDown, Mail, Phone, User, Users } from "lucide-react";
import toast from "react-hot-toast";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  passengers: "1",
};

const passengerOptions = Array.from({ length: 20 }, (_, index) => String(index + 1));

const inputClass =
  "w-full bg-transparent text-sm text-white outline-none placeholder:text-white/60";

function KaabaMark({ gradientId }: { gradientId: string }) {
  return (
    <svg viewBox="0 0 40 40" className="mx-auto h-9 w-9" aria-hidden>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f0d78c" />
          <stop offset="50%" stopColor="#d4af37" />
          <stop offset="100%" stopColor="#b8962e" />
        </linearGradient>
      </defs>
      <rect x="8" y="10" width="24" height="22" rx="1.5" fill={`url(#${gradientId})`} />
      <rect x="10" y="12" width="20" height="18" rx="1" fill="#1a1408" />
      <rect x="10" y="18" width="20" height="3.5" fill={`url(#${gradientId})`} />
      <path d="M20 12.5v17" stroke="#d4af37" strokeWidth="0.7" opacity="0.75" />
    </svg>
  );
}

function MosqueSkyline() {
  return (
    <svg
      viewBox="0 0 320 64"
      className="pointer-events-none absolute inset-x-6 bottom-6 h-14 w-auto opacity-[0.18]"
      aria-hidden
    >
      <path
        fill="currentColor"
        className="text-white"
        d="M8 64V36l10-6 10 6v28H8zm28 0V28c0-8 6-14 14-14s14 6 14 14v36H36zm36 0V40l12-18 12 18v24H72zm40 0V22c4-10 12-16 20-16s16 6 20 16v42h-40zm48 0V34l14-10 14 10v30h-28zm40 0V26c0-9 7-16 16-16s16 7 16 16v38h-32zm40 0V38l11-8 11 8v26h-22zm34 0V30c0-7 5-12 12-12s12 5 12 12v34h-24z"
      />
      <circle cx="126" cy="10" r="3" className="fill-gold" />
    </svg>
  );
}

function FieldRow({
  icon,
  children,
}: {
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 rounded-full border border-white/25 bg-white/15 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] backdrop-blur-md transition focus-within:border-gold/70 focus-within:bg-white/22">
      <span className="shrink-0 text-white/90">{icon}</span>
      {children}
    </div>
  );
}

export function HeroInquiryForm() {
  const markId = useId().replace(/:/g, "");
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  function update(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const passengers = Number(form.passengers);
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      toast.error("Please enter your name, email and mobile number.");
      return;
    }
    if (!Number.isInteger(passengers) || passengers < 1 || passengers > 20) {
      toast.error("Enter between 1 and 20 passengers.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "hero",
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          passengers,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        throw new Error(data.error || "Could not send your inquiry");
      }
      toast.success("Inquiry sent — our team will get back to you shortly.");
      setForm(emptyForm);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not send your inquiry");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="relative mx-auto w-full max-w-md overflow-hidden rounded-[1.6rem] border border-gold/50 bg-white/20 shadow-[0_0_0_1px_rgba(212,175,55,0.22),0_18px_50px_rgba(0,0,0,0.28),0_0_28px_rgba(212,175,55,0.2)] backdrop-blur-md lg:mx-0 lg:max-w-none"
    >
      <div className="absolute inset-0 bg-charcoal/20" aria-hidden />
      <MosqueSkyline />

      <div className="relative grid gap-3 px-6 py-6 sm:px-7 sm:py-7">
        <div className="text-center">
          {/* <KaabaMark gradientId={`kaaba-gold-${markId}`} /> */}
          <h2 className="mt-3 font-display text-xl font-semibold tracking-wide text-white sm:text-2xl">
            Plan Your Blessed <span className="text-gold">Umrah</span>
          </h2>
          <p className="mt-1.5 text-xs text-white/75 sm:text-sm">
            Let us take care of your spiritual journey
          </p>
          
        </div>

        <FieldRow icon={<User className="h-4 w-4" aria-hidden />}>
          <input
            required
            name="name"
            autoComplete="name"
            aria-label="Full Name"
            className={inputClass}
            placeholder="Full Name"
            value={form.name}
            onChange={(event) => update("name", event.target.value)}
          />
        </FieldRow>
        <FieldRow icon={<Mail className="h-4 w-4" aria-hidden />}>
          <input
            required
            type="email"
            name="email"
            autoComplete="email"
            aria-label="Email Address"
            className={inputClass}
            placeholder="Email Address"
            value={form.email}
            onChange={(event) => update("email", event.target.value)}
          />
        </FieldRow>
        <FieldRow icon={<Phone className="h-4 w-4" aria-hidden />}>
          <input
            required
            type="tel"
            name="phone"
            autoComplete="tel"
            aria-label="Mobile Number"
            className={inputClass}
            placeholder="Mobile Number"
            value={form.phone}
            onChange={(event) => update("phone", event.target.value)}
          />
        </FieldRow>
        <FieldRow icon={<Users className="h-4 w-4" aria-hidden />}>
          <div className="relative min-w-0 flex-1">
            <span className="pointer-events-none block text-sm text-white/70">
              {form.passengers === "1"
                ? "Number of Passengers"
                : `${form.passengers} Passengers`}
            </span>
            <select
              required
              name="passengers"
              aria-label="Number of Passengers"
              className="absolute inset-0 cursor-pointer appearance-none opacity-0"
              value={form.passengers}
              onChange={(event) => update("passengers", event.target.value)}
            >
              {passengerOptions.map((count) => (
                <option key={count} value={count} className="text-charcoal">
                  {count}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70"
              aria-hidden
            />
          </div>
        </FieldRow>

        <button
          type="submit"
          disabled={submitting}
          className="relative mt-1 flex w-full items-center justify-center gap-3 overflow-hidden rounded-full border border-gold bg-white py-3 pl-5 pr-3 text-sm font-semibold tracking-wide text-gold-dark shadow-sm transition-all before:absolute before:bottom-0 before:left-0 before:top-0 before:z-0 before:h-full before:w-0 before:bg-gold before:transition-all before:duration-500 hover:text-charcoal hover:shadow-md hover:shadow-gold/30 hover:before:w-full disabled:pointer-events-none disabled:opacity-60"
        >
          <span className="relative z-10 flex flex-1 items-center justify-center gap-3">
            <span className="flex-1 text-center">
              {submitting ? "Sending…" : "Submit Request"}
            </span>
            {!submitting ? (
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-charcoal text-gold">
                <ArrowRight className="h-4 w-4" aria-hidden />
              </span>
            ) : null}
          </span>
        </button>
      </div>
    </form>
  );
}
