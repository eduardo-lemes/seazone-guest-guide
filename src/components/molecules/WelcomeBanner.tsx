import { MessageCircle, MapPin, Star } from "lucide-react";

type Props = { propertyName: string };

export function WelcomeBanner({ propertyName }: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
      <p className="text-base font-semibold text-[#1a2a4a]">
        Bem-vindo ao <span className="text-[#F07060]">{propertyName}</span>
      </p>
      <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
        Este guia reúne tudo que você precisa para a sua estadia — acesso, regras e comodidades do imóvel,
        recomendações personalizadas da região e um assistente virtual disponível para qualquer dúvida.
      </p>
      <div className="mt-4 flex flex-wrap gap-4">
        {[
          { icon: <MapPin size={13} />, text: "Informações do imóvel" },
          { icon: <Star size={13} />, text: "Experiências na região" },
          { icon: <MessageCircle size={13} />, text: "Assistente virtual" },
        ].map(({ icon, text }) => (
          <span key={text} className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className="text-[#F07060]">{icon}</span>
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
