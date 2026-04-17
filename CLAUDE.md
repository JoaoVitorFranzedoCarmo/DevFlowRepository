# DevFlow — Guia para Claude Code

## Visão Geral

Monorepo com frontend React (Vite) e backend Node.js/Express/Prisma/TypeScript.

- **Frontend**: `Front/` — React 18, Vite, Tailwind CSS
- **Backend**: `Back/prisma/` — Node.js, Express, TypeScript, Prisma ORM, PostgreSQL

## Comandos Principais (Backend)

```bash
cd Back/prisma
npm run dev          # servidor dev com hot reload
npm run typecheck    # tsc --noEmit (zero erros exigido)
npm run build        # compilação produção
npm test             # jest
```

## Arquitetura do Backend

```
src/
├── config/          # database.ts (Singleton), env.ts
├── controllers/     # handlers HTTP — leem req, chamam service, escrevem res
├── services/        # lógica de negócio — chamam repositories
├── repositories/    # acesso a dados — todas as chamadas Prisma
├── strategies/      # algoritmos intercambiáveis (Strategy Pattern)
├── events/          # EventEmitter singleton (Observer Pattern)
├── routes/          # definição de rotas Express
├── middlewares/     # auth, error, role, validate
├── validators/      # schemas Zod por domínio
└── utils/           # asyncHandler, errors, ownership
```

## Design Patterns Implementados

### 1. Singleton

**Onde**: `src/config/database.ts` e `src/events/event-emitter.ts`

- `database.ts`: `globalThis` evita múltiplas instâncias do PrismaClient durante hot reload
- `event-emitter.ts`: EventEmitter global único — preservado entre recargas em dev

### 2. Repository Pattern

**Onde**: `src/repositories/`

- `TaskRepository` — encapsula todos os `prisma.task.*`, `prisma.taskPrioritization.*`, `prisma.taskDependency.*`
- `ComponentRepository` — encapsula todos os `prisma.component.*`
- Services recebem o repository via construtor (preparado para injeção de dependência)

### 3. Strategy Pattern

**Onde**: `src/strategies/`

- `PrioritizationStrategy` — interface com `score(p): number`
  - `WSJFStrategy`: `(value × importance × urgency) / effort` — padrão do TaskService
  - `EisenhowerStrategy`: `urgency × importance`
  - Uso: `taskService.setPrioritizationStrategy(new EisenhowerStrategy())`
- `DocumentGenerationStrategy` — interface com `generate(data): string`
  - `HtmlGenerationStrategy`: gera HTML completo
  - `PdfGenerationStrategy`: gera markup texto para PDF
  - Uso: `GET /api/documents/:id/content?format=PDF`

### 4. Observer Pattern

**Onde**: `src/events/event-emitter.ts` + serviços

- `moveTask()` emite `task:status_changed` com `{ taskId, oldStatus, newStatus, assigneeId }`
- `NotificationService` escuta `task:status_changed` e identifica usuários com push habilitado

## Regras

- `npm run typecheck` deve ter zero erros antes de qualquer commit
- Nunca quebrar rotas existentes da API
- Services aceitam repository via construtor — use o default singleton em produção
