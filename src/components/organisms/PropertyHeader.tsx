import Image from "next/image";
import { BedDouble, Bath, Users, MapPin } from "lucide-react";
import { AmenityList } from "@/components/molecules/AmenityList";
import type { Property } from "@/types/property";

type PropertyHeaderProps = {
  property: Property;
};

export function PropertyHeader({ property }: PropertyHeaderProps) {
  const { address } = property;

  return (
    <div>
      <div className="relative -mx-4 h-[300px] overflow-hidden sm:mx-0 sm:h-[480px] sm:rounded-2xl">
        <Image
          src={property.images[0]}
          alt={property.name}
          fill
          sizes="(max-width: 672px) 100vw, 672px"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <div className="flex items-end justify-between gap-3">
            <h1 className="text-2xl font-bold text-white drop-shadow sm:text-3xl">
              {property.name}
            </h1>
            <span className="shrink-0 rounded-full border border-white/30 bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
              {property.propertyType}
            </span>
          </div>
          <p className="mt-1.5 flex items-center gap-1 text-sm text-white/80">
            <MapPin size={13} />
            {address.neighborhood}, {address.city} — {address.state}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {[
          { icon: <BedDouble size={14} />, label: `${property.bedroomQuantity} quarto${property.bedroomQuantity > 1 ? "s" : ""}` },
          { icon: <Bath size={14} />, label: `${property.bathroomQuantity} banheiro${property.bathroomQuantity > 1 ? "s" : ""}` },
          { icon: <Users size={14} />, label: `Até ${property.guestCapacity} hóspedes` },
        ].map(({ icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 shadow-sm"
          >
            <span className="text-[#F07060]">{icon}</span>
            {label}
          </div>
        ))}
      </div>

      <div className="mt-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
          Amenidades
        </p>
        <AmenityList amenities={property.amenities} />
      </div>
    </div>
  );
}
