import { Phone, MapPin } from "lucide-react";
import type { Property } from "@/types/property";

type ContactSectionProps = {
  property: Property;
};

export function ContactSection({ property }: ContactSectionProps) {
  const { address } = property;
  const fullAddress = [
    `${address.street}, ${address.number}`,
    address.complement,
    address.neighborhood,
    `${address.city} — ${address.state}`,
    address.postalCode,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
        <div>
          <p className="text-xs text-slate-400">Anfitrião</p>
          <p className="font-semibold text-slate-900">{property.hostName}</p>
        </div>
        <a
          href={`tel:${property.hostPhone}`}
          className="flex items-center gap-2 rounded-lg bg-[#F07060] px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-[#e8614f]"
        >
          <Phone size={14} />
          Ligar
        </a>
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
        <MapPin size={16} className="mt-0.5 shrink-0 text-[#F07060]" />
        <p className="text-sm text-slate-600">{fullAddress}</p>
      </div>
    </div>
  );
}
