import Image from "next/image";
import { MapPin, BedDouble, Bath, Users } from "lucide-react";
import type { Property } from "@/types/property";

type Props = { property: Property };

export function PropertyHeader({ property }: Props) {
  const { address } = property;

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

        <div className="flex flex-1 flex-col justify-between p-8">
          <div>
            <span className="inline-block rounded-full border border-[#F07060]/25 bg-[#F07060]/8 px-3 py-0.5 text-xs font-semibold text-[#F07060]">
              {property.propertyType}
            </span>
            <h1 className="mt-3 text-2xl font-bold leading-tight text-[#1a2a4a] md:text-3xl">
              {property.name}
            </h1>
            <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
              <MapPin size={13} className="shrink-0 text-[#F07060]" />
              {address.neighborhood}, {address.city} — {address.state}
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {[
              { icon: <BedDouble size={15} />, label: `${property.bedroomQuantity} quarto${property.bedroomQuantity > 1 ? "s" : ""}` },
              { icon: <Bath size={15} />, label: `${property.bathroomQuantity} banheiro${property.bathroomQuantity > 1 ? "s" : ""}` },
              { icon: <Users size={15} />, label: `Até ${property.guestCapacity} hóspedes` },
            ].map(({ icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-2.5 text-sm text-slate-700"
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
