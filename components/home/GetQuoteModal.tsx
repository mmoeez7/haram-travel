"use client";

import { useEffect, useId, useState } from "react";
import { ArrowRight, Mail, Phone, User, Users, X } from "lucide-react";
import toast from "react-hot-toast";

const emptyForm = {
  name: "",
  phone: "",
  email: "",
  passengers: "1",
};

const passengerOptions = Array.from({ length: 20 }, (_, index) => String(index + 1));

const fieldShell =
  "flex items-center gap-3 rounded-xl border border-[#E5E0D6] bg-white px-3.5 py-3 transition focus-within:border-gold focus-within:shadow-[0_0_0_3px_rgba(197,160,56,0.18)]";

const inputClass =
  "min-w-0 flex-1 border-0 bg-transparent text-sm text-charcoal outline-none placeholder:text-muted";

const SHOW_DELAY_MS = 6000;

export function GetQuoteModal() {
  const titleId = useId();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setOpen(true), SHOW_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function update(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function close() {
    setOpen(false);
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const passengers = Number(form.passengers);
    const missing: string[] = [];
    if (!form.name.trim()) missing.push("name");
    if (!form.phone.trim()) missing.push("phone");
    if (!form.email.trim()) missing.push("email");
    if (missing.length) {
      const list =
        missing.length === 1
          ? missing[0]
          : missing.length === 2
            ? `${missing[0]} and ${missing[1]}`
            : `${missing[0]}, ${missing[1]} and ${missing[2]}`;
      toast.error(`Please enter your ${list}.`);
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
      toast.success("Quote request sent — our team will get back to you shortly.");
      setForm(emptyForm);
      close();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not send your inquiry");
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) return null;

  return (
    <div
      className="quote-backdrop fixed inset-0 z-[60] flex items-center justify-center bg-charcoal/50 p-4 backdrop-blur-[2px] sm:p-6"
      onClick={close}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="quote-panel relative w-full max-w-[440px] rounded-3xl border border-[#EAE3D6] bg-white p-6 shadow-[0_24px_70px_rgba(26,26,26,0.22)] sm:p-8"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={close}
          className="absolute right-3.5 top-3.5 inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#E5E0D6] bg-white text-muted shadow-sm transition hover:bg-cream hover:text-charcoal"
          aria-label="Close"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>

        <div className="pr-8 text-center sm:pr-10">
          <h2
            id={titleId}
            className="font-display text-2xl font-bold tracking-tight text-charcoal sm:text-[1.75rem]"
          >
            Get a Quote
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            We&apos;re here to help you plan the perfect Umrah trip.
          </p>
        </div>

        <form onSubmit={onSubmit} className="mt-6 space-y-3.5">
          <div className={`quote-field ${fieldShell}`}>
            <User className="h-4 w-4 shrink-0 text-gold-dark" aria-hidden />
            <input
              required
              name="name"
              autoComplete="name"
              className={inputClass}
              placeholder="Full Name *"
              value={form.name}
              onChange={(event) => update("name", event.target.value)}
            />
          </div>

          <div className={`quote-field ${fieldShell}`}>
            <Phone className="h-4 w-4 shrink-0 text-gold-dark" aria-hidden />
            <input
              required
              type="tel"
              name="phone"
              autoComplete="tel"
              inputMode="tel"
              className={inputClass}
              placeholder="Phone *"
              value={form.phone}
              onChange={(event) => update("phone", event.target.value)}
            />
          </div>

          <div className={`quote-field ${fieldShell}`}>
            <Mail className="h-4 w-4 shrink-0 text-gold-dark" aria-hidden />
            <input
              required
              type="email"
              name="email"
              autoComplete="email"
              inputMode="email"
              className={inputClass}
              placeholder="Email *"
              value={form.email}
              onChange={(event) => update("email", event.target.value)}
            />
          </div>

          <div className={`quote-field ${fieldShell}`}>
            <Users className="h-4 w-4 shrink-0 text-gold-dark" aria-hidden />
            <select
              required
              name="passengers"
              className={`${inputClass} appearance-none pr-1`}
              value={form.passengers}
              onChange={(event) => update("passengers", event.target.value)}
              aria-label="Number of passengers"
            >
              {passengerOptions.map((count) => (
                <option key={count} value={count}>
                  {count === "1"
                    ? "No. Of Passengers * — 1"
                    : `No. Of Passengers * — ${count}`}
                </option>
              ))}
            </select>
          </div>

          <div className="quote-field pt-1">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-gold text-sm font-bold text-charcoal shadow-sm transition hover:bg-gold-dark hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Sending…" : "Submit Request"}
              {!submitting ? <ArrowRight className="h-4 w-4" aria-hidden /> : null}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
