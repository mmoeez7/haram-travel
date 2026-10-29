"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function PackageFinder() {
  const router = useRouter();
  const [form, setForm] = useState({
    departure: "London Gatwick",
    month: "January 2026",
    pilgrims: "4 Family (Quad)",
    comfort: "3* Economy",
  });

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams(form);
    router.push(`/booking-form?${params.toString()}`);
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto max-w-5xl rounded-xl border border-gold-soft/40 bg-[#f4e8cc] p-3 shadow-xl sm:rounded-2xl sm:p-4 md:p-5"
    >
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
        <label className="block text-left">
          <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-gold-dark">
            UK Departure
          </span>
          <select
            className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-charcoal outline-none focus:border-gold"
            value={form.departure}
            onChange={(e) => setForm((f) => ({ ...f, departure: e.target.value }))}
          >
            <option>London Gatwick</option>
            <option>London Heathrow</option>
            <option>Manchester</option>
            <option>Birmingham</option>
          </select>
        </label>
        <label className="block text-left">
          <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-gold-dark">
            Target Month
          </span>
          <select
            className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-charcoal outline-none focus:border-gold"
            value={form.month}
            onChange={(e) => setForm((f) => ({ ...f, month: e.target.value }))}
          >
            <option>January 2026</option>
            <option>February 2026</option>
            <option>Ramadan 2026</option>
            <option>Easter 2026</option>
            <option>Flexible</option>
          </select>
        </label>
        <label className="block text-left">
          <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-gold-dark">
            Pilgrims (PAX)
          </span>
          <select
            className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-charcoal outline-none focus:border-gold"
            value={form.pilgrims}
            onChange={(e) => setForm((f) => ({ ...f, pilgrims: e.target.value }))}
          >
            <option>1 Adult</option>
            <option>2 Couple</option>
            <option>4 Family (Quad)</option>
            <option>6+ Group</option>
          </select>
        </label>
        <label className="block text-left">
          <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-gold-dark">
            Hotel Comfort
          </span>
          <select
            className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-charcoal outline-none focus:border-gold"
            value={form.comfort}
            onChange={(e) => setForm((f) => ({ ...f, comfort: e.target.value }))}
          >
            <option>3* Economy</option>
            <option>4* Executive</option>
            <option>5* VIP Clock Tower</option>
          </select>
        </label>
        <div className="flex items-end">
          <Button type="submit" variant="dark" className="w-full !rounded-full !py-3">
            Find My Package →
          </Button>
        </div>
      </div>
    </form>
  );
}
