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
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-start justify-between gap-2">
        <p className="font-semibold text-slate-900">{name}</p>
        <span className="shrink-0 text-xs text-slate-500">{distance}</span>
      </div>
      <p className="mt-1 text-sm text-slate-600">{description}</p>
    </div>
  );
}

type SectionProps = {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
};

function SubSection({ icon, title, children }: SectionProps) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2 text-slate-700">
        {icon}
        <h3 className="font-semibold">{title}</h3>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

export function ExperienceGuide({ content }: ExperienceGuideProps) {
  return (
    <div className="space-y-6">
      <p className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800">
        {content.welcomeMessage}
      </p>

      {content.restaurants.length > 0 && (
        <SubSection icon={<Utensils size={16} />} title="Restaurantes">
          {content.restaurants.map((r) => (
            <PlaceCard key={r.name} name={r.name} distance={r.distance} description={r.description} />
          ))}
        </SubSection>
      )}

      {content.attractions.length > 0 && (
        <SubSection icon={<Landmark size={16} />} title="Atrações">
          {content.attractions.map((a) => (
            <PlaceCard key={a.name} name={a.name} distance={a.distance} description={a.description} />
          ))}
        </SubSection>
      )}

      {content.essentials.length > 0 && (
        <SubSection icon={<ShoppingBag size={16} />} title="Serviços Essenciais">
          {content.essentials.map((e) => (
            <PlaceCard key={e.name} name={e.name} distance={e.distance} description={e.description} />
          ))}
        </SubSection>
      )}

      <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
        <Lightbulb size={16} className="mt-0.5 shrink-0 text-amber-600" />
        <p className="text-sm text-amber-800">{content.seasonalTip}</p>
      </div>
    </div>
  );
}
