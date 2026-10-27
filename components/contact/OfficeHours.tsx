import { SITE } from "@/lib/constants";

export function OfficeHours() {
  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-border bg-white p-6">
        <h3 className="font-display text-lg font-semibold uppercase tracking-wide text-charcoal">
          London Office Opening Hours
        </h3>
        <ul className="mt-4 space-y-2 text-sm text-muted">
          <li className="flex justify-between gap-4">
            <span>Monday – Friday</span>
            <span className="font-medium text-charcoal">9:00 AM – 7:30 PM</span>
          </li>
          <li className="flex justify-between gap-4">
            <span>Saturday</span>
            <span className="font-medium text-charcoal">10:00 AM – 5:00 PM</span>
          </li>
          <li className="flex justify-between gap-4">
            <span>Sunday / Bank Holidays</span>
            <span className="font-medium text-charcoal">Appointments only</span>
          </li>
        </ul>
      </div>

      <div className="rounded-2xl border border-border bg-white p-6">
        <h3 className="font-display text-lg font-semibold uppercase tracking-wide text-charcoal">
          Saudi Arabia Ground Operations
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Dedicated staff at Makkah Concierge Office and Jeddah Airport Curbside Desk for arrivals,
          transfers, and hotel check-in support.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-cream-dark p-6">
        <h3 className="font-display text-lg font-semibold uppercase tracking-wide text-charcoal">
          Official Licensing
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          {SITE.legalName} — ATOL protected flight-inclusive packages and IATA-aligned ticketing
          partners for financially secure pilgrim travel.
        </p>
      </div>
    </div>
  );
}
