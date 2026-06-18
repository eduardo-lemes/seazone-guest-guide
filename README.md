# Seazone Guest Guide

Guia digital personalizado para hóspedes de imóveis Seazone. Cada propriedade tem uma URL única (ex: `/FLN001`) com conteúdo gerado por IA e assistente virtual com streaming.

---

## Decisões Técnicas

### Arquitetura

Clean Architecture com Atomic Design no frontend. A separação em camadas garante que a lógica de negócio (`application/`) não depende de detalhes de infraestrutura (banco ou IA), tornando cada parte testável de forma isolada.

```
src/
├── application/          # Casos de uso e portas (interfaces)
│   ├── ports/            # IExperienceGuideGenerator, IExperienceGuideRepository
│   └── use-cases/        # GenerateExperienceGuide
├── infrastructure/       # Implementações concretas
│   ├── ai/               # ClaudeExperienceGuideGenerator + prompts
│   └── db/               # PrismaExperienceGuideRepository
├── app/                  # Next.js App Router (rotas e API handlers)
├── components/           # Atomic Design: atoms → molecules → organisms → templates
├── lib/db/               # Singleton Prisma + queries
└── types/                # Tipos de domínio
```

### Geração de Guia de Experiências

O guia é gerado uma única vez via `POST /api/experiences/[code]` e armazenado no banco. Nas requisições seguintes, o cache é retornado sem chamar a IA.

- **`@anthropic-ai/sdk`** com `messages.parse()` + `AutoParseableOutputFormat<T>` para output estruturado em JSON validado — sem Zod, sem parsing manual
- `thinking: { type: "adaptive" }` ativa raciocínio estendido quando necessário
- O prompt injeta nome, cidade, bairro, tipo, capacidade e comodidades do imóvel para grounding real

### Chat com Streaming

- **Vercel AI SDK v6** (`streamText` + `toUIMessageStreamResponse()`) no route handler
- **`@ai-sdk/react`** v6 no cliente: `useChat` com `DefaultChatTransport` para passar o `propertyCode` via body
- `v6` não expõe `input`/`handleInputChange` — estado do input gerenciado com `useState` local
- System prompt injeta os dados completos do imóvel para que o assistente responda com contexto real

### Testes

TDD puro: testes escritos antes da implementação em todos os casos de uso e componentes. 48 testes, 100% de cobertura de linhas.

- **Vitest 4 + happy-dom** para componentes React
- Mocks de `useChat` e `DefaultChatTransport` com `vi.fn()` (não arrow functions — incompatíveis com `new`)
- `vi.mocked()` para type-safe mocking

---

## Stack

| Camada | Tecnologia |
|--------|------------|
| Framework | Next.js 16.2.9 (App Router) |
| Linguagem | TypeScript strict |
| Estilo | Tailwind CSS v4 (CSS-first) |
| ORM | Prisma 6 |
| IA — Geração | `@anthropic-ai/sdk` ^0.104.2 |
| IA — Chat | Vercel AI SDK v6 + `@ai-sdk/anthropic` |
| Testes | Vitest 4 + Testing Library + happy-dom |
| Banco (dev) | PostgreSQL via Docker |
| Banco (prod) | Supabase |
| Deploy | Vercel |

---

## Setup Local

### Pré-requisitos

- Node.js 20+
- Docker (para PostgreSQL local)

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

### 3. Subir PostgreSQL

```bash
docker run -d \
  --name seazone-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=seazone \
  -p 5432:5432 \
  postgres:16
```

### 4. Migrar banco e popular seed

```bash
npx prisma migrate dev
npm run db:seed
```

### 5. Rodar em desenvolvimento

```bash
npm run dev
```

Acesse `http://localhost:3000/FLN001` ou `http://localhost:3000/GRM001`.

---

## Testes

```bash
npm run test:run          # todos os testes
npm run test:coverage     # com relatório de cobertura
```

---

## Deploy

### Supabase

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Copie a **Connection string** (modo `Transaction` para Vercel Serverless): `Settings → Database → Connection string`
3. Adicione `?pgbouncer=true&connection_limit=1` ao final da URL

### Vercel

1. Importe o repositório em [vercel.com](https://vercel.com)
2. Configure as variáveis de ambiente:

| Variável | Valor |
|----------|-------|
| `DATABASE_URL` | Connection string do Supabase (com `?pgbouncer=true&connection_limit=1`) |
| `ANTHROPIC_API_KEY` | Chave da API Anthropic |

3. No painel da Vercel, adicione o comando de build:

```
npx prisma generate && next build
```

4. Rode as migrações e o seed apontando para o banco de produção:

```bash
DATABASE_URL="<sua-url-supabase>" npx prisma migrate deploy
DATABASE_URL="<sua-url-supabase>" npm run db:seed
```

---

## Imóveis disponíveis no seed

| Código | Imóvel | Cidade |
|--------|--------|--------|
| `FLN001` | Apartamento Beira-Mar | Florianópolis/SC |
| `GRM001` | Chalé da Serra | Gramado/RS |
