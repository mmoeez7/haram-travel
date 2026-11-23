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
  "brand-hero-input w-full rounded-xl border-[1.5px] border-[#E0D7C8] bg-[#FAF8F5] px-3.5 py-2.5 text-xs font-medium text-charcoal outline-none transition placeholder:text-slate-400 focus:border-gold focus:bg-white focus:shadow-[0_0_0_3px_rgba(197,160,56,0.2)] sm:text-[13px]";

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
      className="scroll-mt-24 rounded-2xl border border-[#EAE3D6] bg-white p-5 shadow-[0_14px_45px_rgba(26,26,26,0.07)] sm:rounded-3xl sm:p-7"
    >
      <h2 className="-mx-5 -mt-5 mb-4 rounded-t-2xl bg-gold/15 px-5 py-3.5 text-center font-display text-xl font-bold tracking-wide text-gold-dark sm:-mx-7 sm:-mt-7 sm:mb-5 sm:rounded-t-3xl sm:px-7 sm:py-4 sm:text-2xl">
        Plan Your Best Journey
      </h2>
      <form
        onSubmit={onSubmit}
        className="grid grid-cols-1 items-end gap-3.5 sm:grid-cols-2 lg:grid-cols-5"
      >
        <div>
          <label
            htmlFor="hero-inquiry-name"
            className="mb-1.5 block text-xs font-bold text-charcoal"
          >
            Full Name
          </label>
          <input
            id="hero-inquiry-name"
            required
            name="name"
            autoComplete="name"
            className={inputClass}
            placeholder="Enter Your Name"
            value={form.name}
            onChange={(event) => update("name", event.target.value)}
          />
        </div>

        <div>
          <label
            htmlFor="hero-inquiry-email"
            className="mb-1.5 block text-xs font-bold text-charcoal"
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
            placeholder="Enter Your Email"
            value={form.email}
            onChange={(event) => update("email", event.target.value)}
          />
        </div>

        <div>
          <label
            htmlFor="hero-inquiry-phone"
            className="mb-1.5 block text-xs font-bold text-charcoal"
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
            placeholder="Enter Your Phone Number"
            value={form.phone}
            onChange={(event) => update("phone", event.target.value)}
          />
        </div>

        <div>
          <label
            htmlFor="hero-inquiry-passengers"
            className="mb-1.5 block text-xs font-bold text-charcoal"
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
            className="flex h-[42px] w-full items-center justify-center gap-1.5 rounded-xl bg-gold px-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-gold-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="whitespace-nowrap">
              {submitting ? "Sending…" : "Request a Quote"}
            </span>
            {!submitting ? (
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            ) : null}
          </button>
        </div>
      </form>
    </div>
  );
}
