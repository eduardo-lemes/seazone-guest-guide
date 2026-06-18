import {
  Wifi, Tv, Wind, UtensilsCrossed, WashingMachine,
  Building2, Flame, ChefHat, Waves
} from "lucide-react";
import type { Amenities } from "@/types/property";

export const AMENITY_CONFIG: Record<string, { label: string; icon: React.ReactNode }> = {
  wifi:           { label: "Wi-Fi",          icon: <Wifi size={16} /> },
  tv:             { label: "TV",             icon: <Tv size={16} /> },
  airConditioning:{ label: "Ar-condicionado",icon: <Wind size={16} /> },
  kitchen:        { label: "Cozinha",        icon: <UtensilsCrossed size={16} /> },
  washingMachine: { label: "Lavanderia",     icon: <WashingMachine size={16} /> },
  elevator:       { label: "Elevador",       icon: <Building2 size={16} /> },
  bbqGrill:       { label: "Churrasqueira",  icon: <Flame size={16} /> },
  dishwasher:     { label: "Lava-louças",    icon: <ChefHat size={16} /> },
  balcony:        { label: "Varanda",        icon: <Waves size={16} /> },
};

type AmenityListProps = {
  amenities: Amenities;
};

export function AmenityList({ amenities }: AmenityListProps) {
  const active = Object.entries(amenities).filter(([, enabled]) => enabled);

  if (active.length === 0) {
    return <p className="text-sm text-slate-500">Nenhuma amenidade informada.</p>;
  }

  return (
    <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {active.map(([key]) => {
        const config = AMENITY_CONFIG[key];
        const label = config?.label ?? key;
        return (
          <li
            key={key}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm"
          >
            <span className="text-emerald-500">{config?.icon}</span>
            {label}
          </li>
        );
      })}
    </ul>
  );
}
