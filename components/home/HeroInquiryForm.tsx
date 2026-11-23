"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  passengers: "1",
};

const passengerOptions = Array.from({ length: 20 }, (_, index) => String(index + 1));

const inputClass =
  "brand-hero-input h-8 w-full rounded-md border border-[#E0D7C8] bg-[#FAF8F5] px-2.5 text-[11px] font-medium text-charcoal outline-none transition placeholder:text-slate-400 focus:border-gold focus:bg-white focus:shadow-[0_0_0_3px_rgba(197,160,56,0.2)] sm:h-[52px] sm:rounded-xl sm:border-[1.5px] sm:px-4 sm:text-[15px]";

export function HeroInquiryForm() {
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  function update(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const passengers = Number(form.passengers);
    const missing: string[] = [];
    if (!form.name.trim()) missing.push("name");
    if (!form.email.trim()) missing.push("email");
    if (!form.phone.trim()) missing.push("mobile number");
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
      toast.success("Inquiry sent — our team will get back to you shortly.");
      setForm(emptyForm);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not send your inquiry");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      id="enquiry-form"
      className="mx-auto max-w-6xl scroll-mt-24 rounded-xl border border-[#EAE3D6] bg-white p-2 shadow-[0_10px_28px_rgba(26,26,26,0.07)] sm:rounded-3xl sm:p-8 sm:shadow-[0_14px_45px_rgba(26,26,26,0.07)] md:p-9"
    >
      <form
        onSubmit={onSubmit}
        className="grid grid-cols-1 items-end gap-1.5 sm:grid-cols-2 sm:gap-5 lg:grid-cols-5"
      >
        <div>
          <label
            htmlFor="hero-inquiry-name"
            className="mb-0.5 block text-[9px] font-bold text-charcoal sm:mb-2 sm:text-sm"
          >
            Full Name
          </label>
          <input
            id="hero-inquiry-name"
            required
            name="name"
            autoComplete="name"
            className={inputClass}
            placeholder="Name"
            value={form.name}
            onChange={(event) => update("name", event.target.value)}
          />
        </div>

        <div>
          <label
            htmlFor="hero-inquiry-email"
            className="mb-0.5 block text-[9px] font-bold text-charcoal sm:mb-2 sm:text-sm"
          >
            Email
          </label>
          <input
            id="hero-inquiry-email"
            required
            type="email"
            name="email"
            autoComplete="email"
            inputMode="email"
            className={inputClass}
            placeholder="Email"
            value={form.email}
            onChange={(event) => update("email", event.target.value)}
          />
        </div>

        <div>
          <label
            htmlFor="hero-inquiry-phone"
            className="mb-0.5 block text-[9px] font-bold text-charcoal sm:mb-2 sm:text-sm"
          >
            Phone Number
          </label>
          <input
            id="hero-inquiry-phone"
            required
            type="tel"
            name="phone"
            autoComplete="tel"
            inputMode="tel"
            className={inputClass}
            placeholder="Phone"
            value={form.phone}
            onChange={(event) => update("phone", event.target.value)}
          />
        </div>

        <div>
          <label
            htmlFor="hero-inquiry-passengers"
            className="mb-0.5 block text-[9px] font-bold text-charcoal sm:mb-2 sm:text-sm"
          >
            No of Passengers
          </label>
          <select
            id="hero-inquiry-passengers"
            required
            name="passengers"
            className={inputClass}
            value={form.passengers}
            onChange={(event) => update("passengers", event.target.value)}
          >
            {passengerOptions.map((count) => (
              <option key={count} value={count}>
                {count === "1" ? "1 Passenger" : `${count} Passengers`}
              </option>
            ))}
          </select>
        </div>

        <div>
          <button
            type="submit"
            disabled={submitting}
            className="flex h-8 w-full items-center justify-center gap-1 rounded-md bg-gold px-2.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm transition hover:bg-gold-dark disabled:cursor-not-allowed disabled:opacity-60 sm:h-[52px] sm:gap-2 sm:rounded-xl sm:px-4 sm:text-sm sm:tracking-wider"
          >
            <span className="whitespace-nowrap">
              {submitting ? "Sending…" : "Request a Quote"}
            </span>
            {!submitting ? (
              <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden />
            ) : null}
          </button>
        </div>
      </form>
    </div>
  );
}
