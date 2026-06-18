# Seazone Guest Guide

Guia digital para hóspedes de imóveis Seazone. Cada propriedade tem uma URL única (ex: `/CWB001`) com conteúdo personalizado gerado por IA, mapa interativo e assistente virtual com streaming.

---

## Princípios de Engenharia

### Clean Architecture
A lógica de negócio (`application/`) é totalmente independente de infraestrutura. O caso de uso `GenerateExperienceGuide` não sabe se o banco é Postgres ou SQLite, nem se a IA é Claude ou GPT — ele depende apenas das interfaces `IExperienceGuideRepository` e `IExperienceGuideGenerator`. Trocar qualquer um dos dois não exige alterar o caso de uso.

### SOLID
- **S** — cada classe tem uma única responsabilidade: `GenerateExperienceGuide` orquestra, `PrismaExperienceGuideRepository` persiste, `VercelAIExperienceGuideGenerator` gera.
- **O** — novos provedores de IA ou banco se adicionam implementando as interfaces existentes, sem modificar o código que as consome.
- **L** — as implementações de repositório e generator são substituíveis sem quebrar os casos de uso (verificado pelos testes com mocks).
- **I** — `IExperienceGuideRepository` e `IExperienceGuideGenerator` são interfaces mínimas, cada uma com um único método.
- **D** — os casos de uso dependem de abstrações (interfaces), não de implementações concretas.

### Clean Code
Nomes autoexplicativos, funções curtas com responsabilidade única, sem comentários que apenas repetem o código. TypeScript strict ativado — sem `any` implícito.

### Atomic Design
Componentes organizados em átomos (`SeazoneIcon`, `Badge`), moléculas (`WelcomeBanner`, `AmenityList`), organismos (`ChatPanel`, `MapView`, `ExperienceGuide`) e templates (`GuideLayout`).

### TDD
Testes escritos antes ou junto com a implementação. 67 testes cobrindo casos de uso, componentes, queries e prompts — sem mocks desnecessários onde o comportamento real pode ser testado.

---

## Arquitetura

```
src/
├── application/        # Casos de uso e interfaces (portas)
│   ├── ports/          # IExperienceGuideGenerator, IExperienceGuideRepository
│   └── use-cases/      # GenerateExperienceGuide
├── infrastructure/     # Implementações concretas
│   ├── ai/             # VercelAIExperienceGuideGenerator + prompts
│   └── db/             # PrismaExperienceGuideRepository
├── app/                # Next.js App Router - rotas e API handlers
├── components/         # Atomic Design: atoms → molecules → organisms → templates
├── lib/                # Singleton Prisma + queries + model factory
└── types/              # Tipos de domínio compartilhados
```

---

## Stack

| Camada | Tecnologia |
|--------|------------|
| Framework | Next.js 16.2.9 (App Router, Turbopack) |
| Linguagem | TypeScript strict |
| Estilo | Tailwind CSS v4 |
| ORM | Prisma 6 |
| IA - Geração de guia | Vercel AI SDK v6 + `@ai-sdk/anthropic` |
| IA - Chat | Vercel AI SDK v6 - `streamText` + `useChat` |
| Mapa | Leaflet + react-leaflet + Nominatim + Overpass API |
| Testes | Vitest 4 + Testing Library + happy-dom |
| Banco | PostgreSQL |

---

## Decisões Técnicas

### Geração do Guia de Experiências

O guia é gerado uma única vez via `POST /api/experiences/[code]` e armazenado no banco. Requisições seguintes retornam o cache sem chamar a IA. Os dados do imóvel (nome, cidade, bairro, tipo, capacidade, comodidades) são injetados no prompt para grounding real.

Para os imóveis seedados, o guia é pré-populado com locais reais curados - restaurantes e atrações que existem no OpenStreetMap - garantindo que o botão "Ver no mapa" funcione sem depender de geração de IA.

### Chat com Streaming

`streamText` no route handler, `useChat` com `DefaultChatTransport` no cliente. O system prompt injeta todos os dados do imóvel para respostas contextualizadas. Respostas estruturadas (Wi-Fi, acesso, horários, recomendações) são parseadas em cards interativos pelo cliente - texto amigável aparece acima de cada card.

### Mapa

O mapa exibe imediatamente após o geocoding (~1s), enquanto os POIs do Overpass API carregam em background. `viewbox` Nominatim restringe buscas de "Ver no mapa" ao entorno do imóvel.

### Testes

TDD: testes escritos antes da implementação. 67 testes cobrindo casos de uso, componentes, queries e prompts.

```
Vitest 4 + happy-dom
Mocks via vi.fn() + vi.mocked() (type-safe)
```

---

## Setup Local

**Pré-requisitos:** Node.js 20+, PostgreSQL

### 1. Instalar dependências

```bash
npm install
```

### 2. Variáveis de ambiente

```bash
cp .env.example .env
```

Preencha `.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/seazone?schema=public"
ANTHROPIC_API_KEY="sk-ant-..."
```

### 3. Migrar banco e popular seed

```bash
npx prisma migrate dev
npm run db:seed
```

### 4. Rodar em desenvolvimento

```bash
npm run dev
```

Abra qualquer URL de imóvel: `http://localhost:3000/FLN001`

---

## Testes

```bash
npm run test:run         # todos os testes
npm run test:coverage    # com relatório de cobertura
```

---

## Imóveis no seed

| Código | Imóvel | Cidade |
|--------|--------|--------|
| `GRM001` | Chalé Serra Gramado | Gramado - RS |
| `POA001` | Loft Gasômetro | Porto Alegre - RS |
| `RIO001` | Apartamento Copacabana | Rio de Janeiro - RJ |
| `CWB001` | Studio Jardim Botânico | Curitiba - PR |
| `FLN001` | Apartamento Beira-Mar | Florianópolis - SC |
