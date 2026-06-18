import Image from "next/image";
import { MapPin, BedDouble, Bath, Users, Clock } from "lucide-react";
import type { Property } from "@/types/property";
import { AMENITY_CONFIG } from "@/components/molecules/AmenityList";

type Props = { property: Property };

export function PropertyHeader({ property }: Props) {
  const { address, rules, amenities } = property;
  const topAmenities = Object.entries(amenities)
    .filter(([, enabled]) => enabled)
    .slice(0, 3)
    .map(([key]) => ({ key, ...(AMENITY_CONFIG[key] ?? { label: key, icon: null }) }));

  return (
    <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200 shadow-sm">
      <div className="flex flex-col md:flex-row md:h-[420px]">
        <div className="relative h-[260px] shrink-0 md:h-full md:w-[56%]">
          <Image
            src={property.images[0]}
            alt={property.name}
            fill
            sizes="(max-width: 768px) 100vw, 56vw"
            className="object-cover"
            priority
          />
        </div>

        <div className="flex flex-1 flex-col gap-4 p-7">
          <div>
            <span className="inline-block rounded-full border border-[#F07060]/25 bg-[#F07060]/8 px-3 py-0.5 text-xs font-semibold text-[#F07060]">
              {property.propertyType}
            </span>
            <h1 className="mt-3 text-2xl font-bold leading-tight text-[#1a2a4a] md:text-[1.65rem]">
              {property.name}
            </h1>
            <p className="mt-1.5 flex items-center gap-1.5 text-sm text-slate-500">
              <MapPin size={13} className="shrink-0 text-[#F07060]" />
              {address.neighborhood}, {address.city} — {address.state}
            </p>
          </div>

          <div className="h-px bg-slate-100" />

          <div className="space-y-2.5">
            <div className="grid grid-cols-2 gap-2.5">
              <div className="rounded-xl bg-slate-50 px-4 py-3">
                <p className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Clock size={11} />
                  Check-in
                </p>
                <p className="mt-1 text-sm font-semibold text-[#1a2a4a]">
                  a partir de {rules.checkInTime}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 px-4 py-3">
                <p className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Clock size={11} />
                  Check-out
                </p>
                <p className="mt-1 text-sm font-semibold text-[#1a2a4a]">
                  até {rules.checkOutTime}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {topAmenities.map(({ key, label, icon }) => (
                <div key={key} className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5">
                  <span className="text-emerald-600 [&>svg]:h-3 [&>svg]:w-3">{icon}</span>
                  <span className="text-xs font-medium text-emerald-700">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="h-px bg-slate-100" />

          <div className="flex flex-wrap gap-2.5">
            {[
              { icon: <BedDouble size={14} />, label: `${property.bedroomQuantity} quarto${property.bedroomQuantity > 1 ? "s" : ""}` },
              { icon: <Bath size={14} />, label: `${property.bathroomQuantity} banheiro${property.bathroomQuantity > 1 ? "s" : ""}` },
              { icon: <Users size={14} />, label: `Até ${property.guestCapacity} hóspedes` },
            ].map(({ icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-1.5 rounded-xl bg-slate-50 px-3.5 py-2 text-sm text-slate-700"
              >
                <span className="text-[#F07060]">{icon}</span>
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
