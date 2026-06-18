import { Utensils, Landmark, ShoppingBag, Lightbulb } from "lucide-react";
import type { ExperienceGuideContent } from "@/types/property";

type ExperienceGuideProps = {
  content: ExperienceGuideContent;
};

type CardProps = {
  name: string;
  distance: string;
  description: string;
  accentColor: string;
};

function PlaceCard({ name, distance, description, accentColor }: CardProps) {
  return (
    <div className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm border-l-[3px] ${accentColor}`}>
      <div className="flex items-start justify-between gap-3">
        <p className="font-semibold text-slate-900">{name}</p>
        <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500">
          {distance}
        </span>
      </div>
      <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{description}</p>
    </div>
  );
}


export function ExperienceGuide({ content }: ExperienceGuideProps) {
  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-[#1a2a4a]/10 bg-[#1a2a4a] px-6 py-5 text-white shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/50">
          Mensagem da Seazone
        </p>
        <p className="mt-2 text-sm leading-relaxed text-white/90">{content.welcomeMessage}</p>
      </div>

      {content.restaurants.length > 0 && (
        <div>
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50">
              <Utensils size={15} className="text-orange-500" />
            </div>
            <h3 className="text-base font-semibold text-[#1a2a4a]">Restaurantes</h3>
          </div>
          <div className="space-y-3">
            {content.restaurants.map((r) => (
              <PlaceCard key={r.name} name={r.name} distance={r.distance} description={r.description} accentColor="border-l-orange-400" />
            ))}
          </div>
        </div>
      )}

      {content.attractions.length > 0 && (
        <div>
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
              <Landmark size={15} className="text-blue-500" />
            </div>
            <h3 className="text-base font-semibold text-[#1a2a4a]">Atrações</h3>
          </div>
          <div className="space-y-3">
            {content.attractions.map((a) => (
              <PlaceCard key={a.name} name={a.name} distance={a.distance} description={a.description} accentColor="border-l-blue-400" />
            ))}
          </div>
        </div>
      )}

      {content.essentials.length > 0 && (
        <div>
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50">
              <ShoppingBag size={15} className="text-violet-500" />
            </div>
            <h3 className="text-base font-semibold text-[#1a2a4a]">Serviços Essenciais</h3>
          </div>
          <div className="space-y-3">
            {content.essentials.map((e) => (
              <PlaceCard key={e.name} name={e.name} distance={e.distance} description={e.description} accentColor="border-l-violet-400" />
            ))}
          </div>
        </div>
      )}

      <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-100">
          <Lightbulb size={14} className="text-amber-600" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-600">Dica da temporada</p>
          <p className="mt-1 text-sm leading-relaxed text-amber-900">{content.seasonalTip}</p>
        </div>
      </div>
    </div>
  );
}
