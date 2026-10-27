import { Lock, Phone, Star } from "lucide-react";
import { SITE, telUrl } from "@/lib/constants";

export function TopBar() {
  return (
    <div className="hidden border-b border-forest/20 bg-forest text-white md:block">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 text-xs tracking-wide lg:px-6">
        <div className="flex items-center gap-2">
          <Lock className="h-3.5 w-3.5 text-gold-soft" />
          <span>Confidential & Secure Pilgrim Data</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="inline-flex items-center gap-1.5">
            <Star className="h-3.5 w-3.5 fill-gold text-gold" />
            Trustpilot {SITE.trustpilotRating}/5
          </span>
          <a href={telUrl()} className="inline-flex items-center gap-1.5 hover:text-gold-soft">
            <Phone className="h-3.5 w-3.5" />
            24/7 UK Booking Helpline: {SITE.phone}
          </a>
        </div>
      </div>
    </div>
  );
}
