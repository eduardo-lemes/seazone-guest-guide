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
      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div>
          <p className="text-xs text-slate-500">Anfitrião</p>
          <p className="font-semibold text-slate-900">{property.hostName}</p>
        </div>
        <a
          href={`tel:${property.hostPhone}`}
          className="flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white"
        >
          <Phone size={14} />
          Ligar
        </a>
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <MapPin size={16} className="mt-0.5 shrink-0 text-slate-400" />
        <p className="text-sm text-slate-700">{fullAddress}</p>
      </div>
    </div>
  );
}
