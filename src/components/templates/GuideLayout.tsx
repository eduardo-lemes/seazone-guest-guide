type SectionProps = {
  title: string;
  children: React.ReactNode;
};

function Section({ title, children }: SectionProps) {
  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold text-slate-900">{title}</h2>
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
    <div className="mx-auto max-w-2xl px-4 py-6 pb-28">
      <div className="space-y-8">
        {header}

        <Section title="Informações de Acesso">{accessInfo}</Section>
        <Section title="Regras da Estadia">{stayRules}</Section>

        {experienceGuide && (
          <Section title="Guia de Experiências">{experienceGuide}</Section>
        )}

        <Section title="Contato">{contact}</Section>
      </div>

      {chatPanel}
    </div>
  );
}
