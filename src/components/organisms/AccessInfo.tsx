import { Wifi, Lock, Car } from "lucide-react";
import type { Operational } from "@/types/property";

type AccessInfoProps = {
  operational: Operational;
};

function InfoCard({
  icon,
  title,
  accent,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`rounded-xl border bg-white p-4 shadow-sm transition-shadow hover:shadow-md border-l-4 ${accent}`}>
      <div className="mb-2 flex items-center gap-2 text-slate-700">
        {icon}
        <h3 className="font-semibold">{title}</h3>
      </div>
      {children}
    </div>
  );
}

export function AccessInfo({ operational }: AccessInfoProps) {
  return (
    <div className="space-y-3">
      <InfoCard icon={<Wifi size={16} className="text-[#F07060]" />} title="Wi-Fi" accent="border-l-[#F07060]">
        <p className="text-sm text-slate-600">
          Rede: <span className="font-medium text-slate-800">{operational.wifiNetwork}</span>
        </p>
        <p className="text-sm text-slate-600">
          Senha: <span className="font-mono font-semibold text-slate-800">{operational.wifiPassword}</span>
        </p>
      </InfoCard>

      <InfoCard icon={<Lock size={16} className="text-[#1a2a4a]" />} title="Acesso ao imóvel" accent="border-l-[#1a2a4a]">
        <p className="text-sm text-slate-600">{operational.propertyAccessInstructions}</p>
        {operational.propertyPassword && (
          <p className="mt-1 text-sm text-slate-600">
            Código: <span className="font-mono font-semibold text-slate-800">{operational.propertyPassword}</span>
          </p>
        )}
      </InfoCard>

      {operational.hasParkingSpot && (
        <InfoCard icon={<Car size={16} className="text-emerald-500" />} title="Estacionamento" accent="border-l-emerald-400">
          {operational.parkingSpotIdentifier && (
            <p className="text-sm font-medium text-slate-800">{operational.parkingSpotIdentifier}</p>
          )}
          {operational.parkingSpotInstructions && (
            <p className="text-sm text-slate-600">{operational.parkingSpotInstructions}</p>
          )}
        </InfoCard>
      )}
    </div>
  );
}
