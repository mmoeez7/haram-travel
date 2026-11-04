"use client";

import { useState } from "react";
import { whatsappUrl } from "@/lib/constants";
import { Button } from "@/components/ui/Button";

const fieldClass =
  "mt-1.5 w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-charcoal outline-none focus:border-gold";

export function InquiryForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  function update(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const text = `Assalamu Alaikum, contact from ${form.name}.
Email: ${form.email}
Contact number: ${form.phone}
Message: ${form.message || "None"}`;
    window.open(whatsappUrl(text), "_blank", "noopener,noreferrer");
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-border bg-white p-6 shadow-sm md:p-8"
    >
      <h2 className="font-display text-2xl font-semibold uppercase tracking-wide text-charcoal">
        Contact Us
      </h2>
      <p className="mt-2 text-sm text-muted">
        Have a question? Fill out the form below, and our team will get back to you as soon as
        possible.
      </p>
      <div className="mt-6 grid gap-4">
        <label className="block text-sm font-medium text-charcoal">
          Name
          <input
            required
            className={fieldClass}
            placeholder="Name"
            value={form.name}
            onChange={(event) => update("name", event.target.value)}
          />
        </label>
        <label className="block text-sm font-medium text-charcoal">
          Email
          <input
            required
            type="email"
            className={fieldClass}
            placeholder="Email"
            value={form.email}
            onChange={(event) => update("email", event.target.value)}
          />
        </label>
        <label className="block text-sm font-medium text-charcoal">
          Contact Number
          <input
            className={fieldClass}
            placeholder="Contact Number"
            value={form.phone}
            onChange={(event) => update("phone", event.target.value)}
          />
        </label>
        <label className="block text-sm font-medium text-charcoal">
          Message
          <textarea
            rows={4}
            className={fieldClass}
            placeholder="Message"
            value={form.message}
            onChange={(event) => update("message", event.target.value)}
          />
        </label>
      </div>
      <Button type="submit" variant="gold" className="mt-6 w-full !py-3">
        Send
      </Button>
    </form>
  );
}

export function BeatPriceForm() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    passengers: "",
    nights: "",
  });

  function update(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const text = `Assalamu Alaikum, Beat My Price quote from ${form.name}.
Phone: ${form.phone}
Email: ${form.email}
Traveling date: ${form.date}
Passengers: ${form.passengers}
Nights: ${form.nights}`;
    window.open(whatsappUrl(text), "_blank", "noopener,noreferrer");
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-border bg-white p-6 shadow-sm md:p-8"
    >
      <h2 className="font-display text-2xl font-semibold uppercase tracking-wide text-charcoal">
        Get a Quote
      </h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-charcoal">
          Name
          <input
            required
            className={fieldClass}
            placeholder="Name"
            value={form.name}
            onChange={(event) => update("name", event.target.value)}
          />
        </label>
        <label className="block text-sm font-medium text-charcoal">
          Phone Number
          <input
            required
            className={fieldClass}
            placeholder="Phone Number"
            value={form.phone}
            onChange={(event) => update("phone", event.target.value)}
          />
        </label>
        <label className="block text-sm font-medium text-charcoal sm:col-span-2">
          Email
          <input
            required
            type="email"
            className={fieldClass}
            placeholder="Email"
            value={form.email}
            onChange={(event) => update("email", event.target.value)}
          />
        </label>
        <label className="block text-sm font-medium text-charcoal">
          Traveling date
          <input
            className={fieldClass}
            placeholder="Traveling date"
            value={form.date}
            onChange={(event) => update("date", event.target.value)}
          />
        </label>
        <label className="block text-sm font-medium text-charcoal">
          No. of Passenger
          <input
            className={fieldClass}
            placeholder="No. of Passenger"
            value={form.passengers}
            onChange={(event) => update("passengers", event.target.value)}
          />
        </label>
        <label className="block text-sm font-medium text-charcoal">
          No. of Nights
          <input
            className={fieldClass}
            placeholder="No. of Nights"
            value={form.nights}
            onChange={(event) => update("nights", event.target.value)}
          />
        </label>
      </div>
      <Button type="submit" variant="gold" className="mt-6 w-full !py-3">
        Send
      </Button>
    </form>
  );
}
