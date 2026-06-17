# Seazone Guest Guide — Plano de Implementação

## Stack Definida
- **Framework:** Next.js 16 (App Router) + TypeScript + Tailwind CSS
- **LLM:** Claude (Anthropic SDK) — `claude-sonnet-4-6`
- **AI Streaming:** Vercel AI SDK (`ai` package)
- **ORM:** Prisma 6
- **Banco em dev:** PostgreSQL local (Docker)
- **Banco em prod:** Supabase
- **Deploy:** Vercel

---

## Onde Paramos

Step 1 concluído. Próximo: Step 2 — camada de dados (types + queries).

---

## Estrutura de Pastas (Atomic Design)

```
src/
├── app/
│   ├── [code]/
│   │   └── page.tsx                  # Rota dinâmica /FLN001
│   └── api/
│       ├── properties/[code]/
│       │   └── route.ts
│       ├── experiences/[code]/
│       │   └── route.ts              # Gera e retorna o guia (com cache no DB)
│       └── chat/
│           └── route.ts              # Streaming do assistente virtual
├── components/
│   ├── atoms/
│   │   ├── Badge.tsx
│   │   ├── Button.tsx
│   │   └── Skeleton.tsx
│   ├── molecules/
│   │   ├── AmenityList.tsx
│   │   ├── RestaurantCard.tsx
│   │   ├── AttractionCard.tsx
│   │   └── ChatMessage.tsx
│   ├── organisms/
│   │   ├── PropertyHeader.tsx
│   │   ├── AccessInfo.tsx
│   │   ├── StayRules.tsx
│   │   ├── ExperienceGuide.tsx
│   │   └── ChatPanel.tsx
│   └── templates/
│       └── GuideLayout.tsx
├── lib/
│   ├── ai/
│   │   ├── experience-generator.ts   # Lógica de geração do guia de experiências
│   │   ├── chat-assistant.ts         # Monta o system prompt do chat
│   │   └── prompts.ts                # Strings de prompt centralizadas
│   ├── db/
│   │   ├── client.ts                 # Singleton do Prisma
│   │   └── queries/
│   │       ├── properties.ts
│   │       └── experiences.ts
│   └── utils/
│       └── format.ts
└── types/
    └── property.ts
```

---

## Schema Prisma

```prisma
model Property {
  code              String   @id
  name              String
  propertyType      String
  bedroomQuantity   Int
  bathroomQuantity  Int
  guestCapacity     Int
  address           Json
  operational       Json
  rules             Json
  amenities         Json
  images            String[]
  hostName          String
  hostPhone         String
  experienceGuide   ExperienceGuide?
}

model ExperienceGuide {
  id           String   @id @default(cuid())
  propertyCode String   @unique
  property     Property @relation(fields: [propertyCode], references: [code])
  content      Json
  generatedAt  DateTime @default(now())
}
```

---

## Seed (dados fictícios do teste)

Dois imóveis: **FLN001** (Florianópolis/SC) e **GRM001** (Gramado/RS) com todos os dados do PDF.

---

## Fluxo da IA — Guia de Experiências

1. Hóspede acessa `/FLN001`
2. Server Component busca `ExperienceGuide` no banco
3. **Se existe** → renderiza direto
4. **Se não existe** → página renderiza com `generating: true`, dispara `POST /api/experiences/FLN001`
5. API gera com Claude (structured output → JSON), persiste no banco
6. Cliente faz polling ou usa state para re-buscar e renderizar

**Prompt strategy:**
- System: especialista local da cidade, responde só em JSON válido
- User: endereço real + data atual + schema esperado + instrução de usar lugares reais

---

## Fluxo da IA — Chat com Streaming

- Route handler `POST /api/chat` usa `streamText` do Vercel AI SDK
- System prompt injeta: dados completos do imóvel + guia de experiências gerado
- Regra explícita no prompt: não inventar dados, se não souber → redirecionar ao anfitrião
- Cliente usa hook `useChat` do Vercel AI SDK

---

## Critérios de Avaliação (mapeados)

| Critério | O que fazer |
|----------|-------------|
| Produto | UX clara, mobile-first, 404 amigável |
| IA | Prompt com grounding real, streaming, sem alucinação, error handling |
| Responsividade | Tailwind mobile-first em todos os componentes |
| Qualidade do Código | TypeScript strict, sem comentários óbvios, separação clara |
| Organização | README detalhado com decisões técnicas |
| Testes | Pelo menos unitários: prompts, queries, componentes atoms |

---

## Ordem de Implementação + Commits

### ✅ Step 0 — Scaffold
`feat: initialize Next.js project with TypeScript and Tailwind`
- create-next-app

---

### ✅ Step 1 — Deps + Prisma + Seed
`feat: setup Prisma with Property and ExperienceGuide models and seed data`
- npm install @anthropic-ai/sdk ai @prisma/client prisma zod tsx dotenv
- prisma/schema.prisma — models Property e ExperienceGuide
- prisma/seed.ts — FLN001 e GRM001
- prisma.config.ts configurado
- .env.example

---

### Step 2 — Camada de dados
`feat: add data layer with types, Prisma client and queries`
- src/types/property.ts
- src/lib/db/client.ts
- src/lib/db/queries/properties.ts
- src/lib/db/queries/experiences.ts

---

### Step 3 — Rota [code] + seções estáticas (1.1–1.4)
`feat: add guide page with property data sections`
- src/app/[code]/page.tsx
- atoms: Badge, Button, Skeleton
- molecules: AmenityList, ChatMessage
- organisms: PropertyHeader, AccessInfo, StayRules
- templates: GuideLayout

---

### Step 4 — API /experiences + geração com Claude
`feat: add experience guide generation via Claude with DB caching`
- src/lib/ai/prompts.ts
- src/lib/ai/experience-generator.ts
- src/app/api/experiences/[code]/route.ts

---

### Step 5 — ExperienceGuide organism + loading state
`feat: add ExperienceGuide section with generation loading feedback`
- molecules: RestaurantCard, AttractionCard
- organisms: ExperienceGuide
- integração com polling/estado na page

---

### Step 6 — API /chat + ChatPanel
`feat: add streaming chat assistant with property context`
- src/lib/ai/chat-assistant.ts
- src/app/api/chat/route.ts
- organisms: ChatPanel

---

### Step 7 — 404 e error states
`feat: add 404 and error pages with friendly UX`
- src/app/not-found.tsx
- src/app/[code]/not-found.tsx
- src/app/error.tsx

---

### Step 8 — Testes unitários
`test: add unit tests for prompts, queries and atom components`
- prompts, queries, atoms

---

### Step 9 — README + Deploy
`docs: add README with technical decisions and setup instructions`
- README.md completo
- variáveis de ambiente para Vercel + Supabase

---

## Notas de Breaking Changes (Next.js 16 / Prisma 6)

- `params` é `Promise` — sempre `await params` em pages e route handlers
- `PageProps<'/[code]'>` e `LayoutProps` são helpers globais (sem import)
- Prisma 6: client gerado em `src/generated/prisma/client`, import de `../src/generated/prisma/client`
- `package.json#prisma` deprecado — seed config vai em `prisma.config.ts`

---

## Regras de Código

- Zero comentários explicando o que o código faz
- Comentar apenas o "por que" quando não for óbvio
- Nomes de variáveis e funções que se explicam
- TypeScript strict — sem `any`
