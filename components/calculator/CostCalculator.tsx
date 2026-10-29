"use client";

import { useMemo, useState } from "react";
import { MessageCircle, Phone } from "lucide-react";
import { SITE, telUrl, whatsappUrl } from "@/lib/constants";
import { Button } from "@/components/ui/Button";

export function CostCalculator() {
  const [price, setPrice] = useState(895);
  const [pilgrims, setPilgrims] = useState(2);
  const [months, setMonths] = useState(6);
  const depositPerPerson = SITE.depositFrom;

  const totals = useMemo(() => {
    const total = price * pilgrims;
    const deposit = depositPerPerson * pilgrims;
    const remaining = Math.max(total - deposit, 0);
    const monthly = months > 0 ? remaining / months : remaining;
    return { total, deposit, remaining, monthly };
  }, [price, pilgrims, months, depositPerPerson]);

  return (
    <div className="mt-10 grid gap-8 lg:grid-cols-2">
      <form className="rounded-2xl border border-border bg-white p-6 shadow-sm md:p-8">
        <h2 className="font-display text-2xl font-semibold uppercase tracking-wide text-charcoal">
          Build Your Plan
        </h2>

        <label className="mt-6 block text-sm font-medium text-charcoal">
          Package price per person (£)
          <input
            type="number"
            min={500}
            step={50}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value) || 0)}
            className="mt-1.5 w-full rounded-lg border border-border bg-cream px-3 py-2.5 text-sm outline-none focus:border-gold"
          />
        </label>

        <label className="mt-4 block text-sm font-medium text-charcoal">
          Number of pilgrims
          <select
            value={pilgrims}
            onChange={(e) => setPilgrims(Number(e.target.value))}
            className="mt-1.5 w-full rounded-lg border border-border bg-cream px-3 py-2.5 text-sm outline-none focus:border-gold"
          >
            {[1, 2, 3, 4, 5, 6, 8, 10].map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? "pilgrim" : "pilgrims"}
              </option>
            ))}
          </select>
        </label>

        <label className="mt-4 block text-sm font-medium text-charcoal">
          Installment months (0% interest)
          <select
            value={months}
            onChange={(e) => setMonths(Number(e.target.value))}
            className="mt-1.5 w-full rounded-lg border border-border bg-cream px-3 py-2.5 text-sm outline-none focus:border-gold"
          >
            {[3, 4, 5, 6, 8, 10, 12].map((n) => (
              <option key={n} value={n}>
                {n} months
              </option>
            ))}
          </select>
        </label>
      </form>

      <div className="rounded-2xl border border-border bg-white p-6 shadow-sm md:p-8">
        <h2 className="font-display text-2xl font-semibold uppercase tracking-wide text-charcoal">
          Your Estimate
        </h2>
        <dl className="mt-6 space-y-4 text-sm">
          <div className="flex justify-between gap-4 border-b border-border pb-3">
            <dt className="text-muted">Total package cost</dt>
            <dd className="font-semibold text-charcoal">£{totals.total.toLocaleString()}</dd>
          </div>
          <div className="flex justify-between gap-4 border-b border-border pb-3">
            <dt className="text-muted">Deposit today (£{depositPerPerson}pp)</dt>
            <dd className="font-semibold text-forest">£{totals.deposit.toLocaleString()}</dd>
          </div>
          <div className="flex justify-between gap-4 border-b border-border pb-3">
            <dt className="text-muted">Remaining balance</dt>
            <dd className="font-semibold text-charcoal">£{totals.remaining.toLocaleString()}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Monthly installment (0%)</dt>
            <dd className="font-display text-3xl font-semibold text-gold-dark">
              £{Math.ceil(totals.monthly).toLocaleString()}
            </dd>
          </div>
        </dl>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button
            href={whatsappUrl(
              `Assalamu Alaikum, I calculated £${price}pp for ${pilgrims} pilgrims over ${months} months. Please confirm a quote.`
            )}
            variant="whatsapp"
            className="!rounded-full"
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle className="h-4 w-4" />
            Chat on WhatsApp
          </Button>
          <Button href={telUrl()} variant="call" className="!rounded-full">
            <Phone className="h-4 w-4" />
            Call {SITE.phone}
          </Button>
        </div>
      </div>
    </div>
  );
}
