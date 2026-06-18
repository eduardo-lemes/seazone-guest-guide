import { Utensils, Landmark, ShoppingBag, Lightbulb } from "lucide-react";
import type { ExperienceGuideContent } from "@/types/property";

type ExperienceGuideProps = {
  content: ExperienceGuideContent;
};

type CardProps = {
  name: string;
  distance: string;
  description: string;
};

function PlaceCard({ name, distance, description }: CardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <p className="font-semibold text-slate-900">{name}</p>
        <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
          {distance}
        </span>
      </div>
      <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{description}</p>
    </div>
  );
}

type SubSectionProps = {
  icon: React.ReactNode;
  title: string;
  color: string;
  children: React.ReactNode;
};

function SubSection({ icon, title, color, children }: SubSectionProps) {
  return (
    <div>
      <div className={`mb-3 flex items-center gap-2 font-semibold ${color}`}>
        {icon}
        <span>{title}</span>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

export function ExperienceGuide({ content }: ExperienceGuideProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-emerald-600 p-5 text-white shadow-sm">
        <p className="text-sm leading-relaxed opacity-90">{content.welcomeMessage}</p>
      </div>

      {content.restaurants.length > 0 && (
        <SubSection icon={<Utensils size={16} />} title="Restaurantes" color="text-orange-600">
          {content.restaurants.map((r) => (
            <PlaceCard key={r.name} name={r.name} distance={r.distance} description={r.description} />
          ))}
        </SubSection>
      )}

      {content.attractions.length > 0 && (
        <SubSection icon={<Landmark size={16} />} title="Atrações" color="text-blue-600">
          {content.attractions.map((a) => (
            <PlaceCard key={a.name} name={a.name} distance={a.distance} description={a.description} />
          ))}
        </SubSection>
      )}

      {content.essentials.length > 0 && (
        <SubSection icon={<ShoppingBag size={16} />} title="Serviços Essenciais" color="text-purple-600">
          {content.essentials.map((e) => (
            <PlaceCard key={e.name} name={e.name} distance={e.distance} description={e.description} />
          ))}
        </SubSection>
      )}

      <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
        <Lightbulb size={16} className="mt-0.5 shrink-0 text-amber-500" />
        <p className="text-sm leading-relaxed text-amber-800">{content.seasonalTip}</p>
      </div>
    </div>
  );
}
