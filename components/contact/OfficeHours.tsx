import { Clock3 } from "lucide-react";

const officeHours = [
  { day: "Monday – Friday", time: "10am – 5pm" },
  { day: "Saturday", time: "11am – 2pm" },
  { day: "Sunday & Bank Holidays", time: "Appointments & 24/7 Helpline" },
];

export function OfficeHours() {
  return (
    <article className="rounded-2xl border border-border bg-[#faf6ef] p-5 md:p-6">
      <h3 className="flex items-center gap-2 font-display text-base font-semibold uppercase tracking-wide text-[#001a26] md:text-lg">
        <Clock3 className="h-4 w-4 shrink-0 text-gold-dark" />
        UK Office Opening Hours
      </h3>

      <ul className="mt-5">
        {officeHours.map((row, index) => (
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
        Whether you&apos;re planning ahead or ready to book, our team is here to guide you with
        honest advice and dedicated support.
      </p>
    </article>
  );
}
