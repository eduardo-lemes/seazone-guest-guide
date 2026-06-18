import { TopNav } from "@/components/organisms/TopNav";

type SectionProps = {
  title: string;
  children: React.ReactNode;
};

function Section({ title, children }: SectionProps) {
  return (
    <section>
      <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-400">
        {title}
      </p>
      {children}
    </section>
  );
}

type GuideLayoutProps = {
  header: React.ReactNode;
  accessInfo: React.ReactNode;
  stayRules: React.ReactNode;
  contact: React.ReactNode;
  experienceGuide?: React.ReactNode;
  chatPanel?: React.ReactNode;
};

export function GuideLayout({
  header,
  accessInfo,
  stayRules,
  contact,
  experienceGuide,
  chatPanel,
}: GuideLayoutProps) {
  return (
    <>
      <TopNav />
      <div className="mx-auto max-w-2xl px-4 pb-28 pt-6">
        <div className="space-y-8">
          {header}

          <div className="h-px bg-slate-200" />

          <Section title="Informações de Acesso">{accessInfo}</Section>
          <Section title="Regras da Estadia">{stayRules}</Section>

          {experienceGuide && (
            <>
              <div className="h-px bg-slate-200" />
              <Section title="Guia de Experiências">{experienceGuide}</Section>
            </>
          )}

          <div className="h-px bg-slate-200" />
          <Section title="Contato">{contact}</Section>
        </div>

        {chatPanel}
      </div>
    </>
  );
}
