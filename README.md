# Seazone Guest Guide

Guia digital para hóspedes de imóveis Seazone. Cada propriedade tem uma URL única (ex: `/FLN001`) com conteúdo personalizado gerado por IA, mapa interativo e assistente virtual com streaming.

---

## Arquitetura

Clean Architecture com Atomic Design no frontend. A lógica de negócio (`application/`) é independente de infraestrutura - o banco e o provedor de IA podem ser trocados sem tocar nos casos de uso.

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
