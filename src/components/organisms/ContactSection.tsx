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
    `${address.city} - ${address.state}`,
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
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50"
        >
          <Phone size={13} />
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
