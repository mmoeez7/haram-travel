"use client";

import { useState } from "react";
import { whatsappUrl } from "@/lib/constants";
import { Button } from "@/components/ui/Button";

type InquiryFormProps = {
  title?: string;
  initial?: Partial<Record<string, string>>;
};

export function InquiryForm({
  title = "Send a Tailored Umrah Inquiry",
  initial = {},
}: InquiryFormProps) {
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    departure: initial.departure ?? "London Heathrow LHR",
    month: initial.month ?? "January 2026",
    guests: initial.pilgrims ?? "2 Adults / Couple",
    comfort: initial.comfort ?? "4* Executive",
    requests: "",
  });

  function update(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const message = `Assalamu Alaikum, new inquiry from ${form.name}.
Mobile: ${form.mobile}
Email: ${form.email}
Departure: ${form.departure}
Travelling: ${form.month}
Guests: ${form.guests}
Hotel: ${form.comfort}
Requests: ${form.requests || "None"}`;
    window.open(whatsappUrl(message), "_blank", "noopener,noreferrer");
  }

  const fieldClass =
    "mt-1.5 w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-charcoal outline-none focus:border-gold";

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-border bg-white p-6 shadow-sm md:p-8"
    >
      <h2 className="font-display text-2xl font-semibold uppercase tracking-wide text-charcoal">
        {title}
      </h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-charcoal">
          Your Full Name
          <input
            required
            className={fieldClass}
            placeholder="Mohammed Ahmed"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
          />
        </label>
        <label className="block text-sm font-medium text-charcoal">
          UK Mobile / WhatsApp
          <input
            required
            className={fieldClass}
            placeholder="+44 7xxx xxx xxx"
            value={form.mobile}
            onChange={(e) => update("mobile", e.target.value)}
          />
        </label>
        <label className="block text-sm font-medium text-charcoal sm:col-span-2">
          Email Address
          <input
            required
            type="email"
            className={fieldClass}
            placeholder="you@email.com"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
          />
        </label>
        <label className="block text-sm font-medium text-charcoal">
          UK Departure Airport
          <select
            className={fieldClass}
            value={form.departure}
            onChange={(e) => update("departure", e.target.value)}
          >
            <option>London Heathrow LHR</option>
            <option>London Gatwick</option>
            <option>Manchester</option>
            <option>Birmingham</option>
          </select>
        </label>
        <label className="block text-sm font-medium text-charcoal">
          Travelling In
          <select
            className={fieldClass}
            value={form.month}
            onChange={(e) => update("month", e.target.value)}
          >
            <option>January 2026</option>
            <option>February 2026</option>
            <option>Ramadan 2026</option>
            <option>Easter 2026</option>
            <option>Flexible / Custom</option>
          </select>
        </label>
        <label className="block text-sm font-medium text-charcoal">
          No. of Guests
          <select
            className={fieldClass}
            value={form.guests}
            onChange={(e) => update("guests", e.target.value)}
          >
            <option>1 Adult</option>
            <option>2 Adults / Couple</option>
            <option>4 Family (Quad)</option>
            <option>6+ Group</option>
          </select>
        </label>
        <label className="block text-sm font-medium text-charcoal">
          Preferred Hotel Comfort
          <select
            className={fieldClass}
            value={form.comfort}
            onChange={(e) => update("comfort", e.target.value)}
          >
            <option>3* Economy</option>
            <option>4* Executive</option>
            <option>5* VIP Clock Tower Front Row</option>
          </select>
        </label>
        <label className="block text-sm font-medium text-charcoal sm:col-span-2">
          Special Requests
          <textarea
            rows={4}
            className={fieldClass}
            placeholder="Wheelchair assistance, specific flights, room preferences…"
            value={form.requests}
            onChange={(e) => update("requests", e.target.value)}
          />
        </label>
      </div>
      <Button type="submit" variant="gold" className="mt-6 w-full !py-3">
        Send Inquiry to WhatsApp & Advisor →
      </Button>
    </form>
  );
}
