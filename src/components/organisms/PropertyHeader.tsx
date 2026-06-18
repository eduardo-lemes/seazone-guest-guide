import Image from "next/image";
import { BedDouble, Bath, Users, MapPin } from "lucide-react";
import { Badge } from "@/components/atoms/Badge";
import { AmenityList } from "@/components/molecules/AmenityList";
import type { Property } from "@/types/property";

type PropertyHeaderProps = {
  property: Property;
};

export function PropertyHeader({ property }: PropertyHeaderProps) {
  const { address } = property;

  return (
    <div>
      <div className="relative h-64 w-full overflow-hidden rounded-xl sm:h-80">
        <Image
          src={property.images[0]}
          alt={property.name}
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="mt-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h1 className="text-2xl font-bold text-slate-900">{property.name}</h1>
          <Badge label={property.propertyType} />
        </div>

        <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
          <MapPin size={14} />
          {address.neighborhood}, {address.city} — {address.state}
        </p>

        <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-700">
          <span className="flex items-center gap-1.5">
            <BedDouble size={16} className="text-slate-400" />
            {property.bedroomQuantity} quarto{property.bedroomQuantity > 1 ? "s" : ""}
          </span>
          <span className="flex items-center gap-1.5">
            <Bath size={16} className="text-slate-400" />
            {property.bathroomQuantity} banheiro{property.bathroomQuantity > 1 ? "s" : ""}
          </span>
          <span className="flex items-center gap-1.5">
            <Users size={16} className="text-slate-400" />
            Até {property.guestCapacity} hóspedes
          </span>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="mb-3 text-base font-semibold text-slate-900">Amenidades</h2>
        <AmenityList amenities={property.amenities} />
      </div>
    </div>
  );
}
