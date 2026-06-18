import { Clock, PawPrint, Cigarette, Baby, PartyPopper, Check, X } from "lucide-react";
import type { Rules } from "@/types/property";

type StayRulesProps = {
  rules: Rules;
};

function TimeRow({ label, time }: { label: string; time: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center gap-2 text-sm text-slate-600">
        <Clock size={14} className="text-[#F07060]" />
        {label}
      </div>
      <span className="text-sm font-semibold text-slate-900">{time}</span>
    </div>
  );
}

function PolicyRow({
  icon,
  label,
  allowed,
}: {
  icon: React.ReactNode;
  label: string;
  allowed: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <div className="flex items-center gap-2 text-sm text-slate-700">
        {icon}
        {label}
      </div>
      {allowed ? (
        <Check size={16} className="text-emerald-500" />
      ) : (
        <X size={16} className="text-red-400" />
      )}
    </div>
  );
}

export function StayRules({ rules }: StayRulesProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <TimeRow label="Check-in a partir de" time={rules.checkInTime} />
        <TimeRow label="Check-out até" time={rules.checkOutTime} />
      </div>

      <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white px-4 shadow-sm transition-shadow hover:shadow-md">
        <PolicyRow icon={<PawPrint size={15} className="text-slate-400" />} label="Animais de estimação" allowed={rules.allowPet} />
        <PolicyRow icon={<Cigarette size={15} className="text-slate-400" />} label="Fumar" allowed={rules.smokingPermitted} />
        <PolicyRow icon={<Baby size={15} className="text-slate-400" />} label="Crianças" allowed={rules.suitableForChildren} />
        <PolicyRow icon={<PartyPopper size={15} className="text-slate-400" />} label="Festas e eventos" allowed={rules.eventsPermitted} />
      </div>
    </div>
  );
}
