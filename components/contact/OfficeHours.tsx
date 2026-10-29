import { Clock3, Star } from "lucide-react";

const londonHours = [
  { day: "Monday – Friday", time: "9:00 AM – 7:30 PM" },
  { day: "Saturday", time: "10:00 AM – 5:00 PM" },
  { day: "Sunday & Bank Holidays", time: "Appointments & 24/7 Helpline" },
];

const saudiContacts = [
  { label: "Jeddah Airport Curbside Desk", phone: "+966 50 123 4567", tel: "+966501234567" },
  { label: "Makkah Concierge Office", phone: "+966 55 987 6543", tel: "+966559876543" },
];

export function OfficeHours() {
  return (
    <div className="grid gap-5">
      <article className="rounded-2xl border border-border bg-[#faf6ef] p-5 md:p-6">
        <h3 className="flex items-center gap-2 font-display text-base font-semibold uppercase tracking-wide text-[#001a26] md:text-lg">
          <Clock3 className="h-4 w-4 shrink-0 text-gold-dark" />
          London Office Opening Hours
        </h3>

        <ul className="mt-5">
          {londonHours.map((row, index) => (
            <li
              key={row.day}
              className={`flex items-start justify-between gap-4 py-3 text-sm ${
                index > 0 ? "border-t border-border" : ""
              }`}
            >
              <span className="font-semibold text-[#001a26]">{row.day}</span>
              <span className="text-right text-[#5c5650]">{row.time}</span>
            </li>
          ))}
        </ul>

        <p className="mt-4 text-sm leading-relaxed text-[#8a847c]">
          Walk-in visitors are warmly welcomed. Free consultations with physical Haram walking maps
          and tea.
        </p>
      </article>

      <article className="rounded-2xl border border-border bg-[#faf6ef] p-5 md:p-6">
        <h3 className="flex items-center gap-2 font-display text-base font-semibold uppercase tracking-wide text-[#001a26] md:text-lg">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-gold/20 text-[10px] font-bold text-gold-dark">
            SA
          </span>
          Saudi Arabia Ground Operations
        </h3>

        <p className="mt-4 text-sm leading-relaxed text-[#5c5650]">
          For currently travelling British pilgrims requiring urgent curbside airport pickup,
          luggage assistance, or Rawdah permit help:
        </p>

        <ul className="mt-4">
          {saudiContacts.map((row, index) => (
            <li
              key={row.label}
              className={`flex flex-wrap items-start justify-between gap-2 py-3 text-sm ${
                index > 0 ? "border-t border-border" : ""
              }`}
            >
              <span className="font-semibold text-[#001a26]">{row.label}</span>
              <a
                href={`tel:${row.tel}`}
                className="font-semibold text-[#1a7a4c] transition hover:underline"
              >
                {row.phone}
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex items-start gap-2 rounded-xl border border-[#c6e8d4] bg-[#e8f7ee] px-3.5 py-3">
          <Star className="mt-0.5 h-4 w-4 shrink-0 fill-[#e0b83a] text-[#e0b83a]" />
          <p className="text-sm leading-relaxed text-[#1a7a4c]">
            Dedicated 24/7 WhatsApp emergency group assigned to every travelling UK family.
          </p>
        </div>
      </article>
    </div>
  );
}
