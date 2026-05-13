# DevFlow — Design Patterns & Pacotes

## Design Patterns

### 1. Singleton

**Arquivos:**
- `apps/api/src/config/database.ts`
- `apps/api/src/events/event-emitter.ts`

**O que faz:**
Garante uma única instância global de objetos críticos durante todo o ciclo de vida da aplicação.

**Por que é Singleton:**
O Singleton se aplica quando criar mais de uma instância quebraria o comportamento esperado do sistema. Aqui há dois casos clássicos:
- `PrismaClient` gerencia um **connection pool** com o PostgreSQL. Múltiplas instâncias = múltiplos pools = conexões esgotadas rapidamente. O banco aceita um número fixo de conexões simultâneas; exceder isso resulta em erro.
- `EventEmitter` é o barramento central de eventos. Se cada módulo criasse o próprio, listeners registrados em um não receberiam eventos emitidos em outro — o sistema de notificações quebraria silenciosamente.

**Como foi feito:**
- `database.ts` usa `globalThis` para armazenar o `PrismaClient`. Em dev, o hot reload do `ts-node-dev` recarrega módulos a cada mudança — sem `globalThis`, cada reload criaria nova instância apesar de o processo Node continuar o mesmo. `globalThis` sobrevive a reloads de módulo.
- `event-emitter.ts` aplica a mesma estratégia para o `EventEmitter`.

```
globalThis.__prisma ??= new PrismaClient()
export const prisma = globalThis.__prisma
```

---

### 2. Repository Pattern

**Arquivos:** `apps/api/src/repositories/`

| Repositório | Modelos Prisma encapsulados |
|---|---|
| `TaskRepository` | `task`, `taskPrioritization`, `taskDependency` |
| `DocumentRepository` | `document`, `documentVersion` |
| `ComponentRepository` | `component`, `lesson` |
| `UserRepository` | `user`, `refreshToken` |
| `NotificationRepository` | `notification`, `notificationSetting` |
| `RolePermissionRepository` | `rolePermission`, `customRole` |
| `SystemConfigRepository` | `systemConfig` |

**O que faz:**
Isola toda lógica de acesso a dados. Nenhum `prisma.*` aparece em controllers ou services diretamente.

**Por que é Repository:**
O Repository se aplica quando a lógica de negócio não deve depender da tecnologia de persistência. Aqui o service não sabe que usa Prisma, PostgreSQL ou qualquer ORM — ele chama métodos como `repo.findMany()` ou `repo.create()`. Isso tem duas consequências práticas:
1. **Testabilidade**: nos testes, `TaskRepository` é substituído por um objeto simples com os mesmos métodos mas sem banco real — sem necessidade de banco em CI.
2. **Centralização**: queries com múltiplos `include`, `groupBy` e `upsert` ficam num só lugar; o service não vira um arquivo de SQL disfarçado de TypeScript.

**Como foi feito:**
Cada repositório é uma classe que usa o `prisma` singleton importado de `config/database.ts`. Services recebem o repositório via construtor — em produção usa-se o singleton exportado (`taskRepository`), em testes passa-se um mock.

```
// controller → service → repository → prisma
class TaskService {
  constructor(private repo: TaskRepository) {}
  async create(data) { return this.repo.create(data) }
}
```

---

### 3. Strategy Pattern

**Arquivos:** `apps/api/src/strategies/`

#### Priorização
Interface: `PrioritizationStrategy.score(params): number`

| Estratégia | Fórmula |
|---|---|
| `WSJFStrategy` | `(value × importance × urgency) / effort` |
| `EisenhowerStrategy` | `urgency × importance` |

Usado em: `POST /api/tasks` e `GET /api/tasks/prioritized`

#### Geração de Documentos
Interface: `DocumentGenerationStrategy.generate(data): string`

| Estratégia | Saída |
|---|---|
| `HtmlGenerationStrategy` | HTML estruturado com seções e syntax highlight |
| `PdfGenerationStrategy` | Base64 de PDF |
| `MarkdownGenerationStrategy` | Markdown com frontmatter |

Usado em: `POST /documents/:id/generate` (gera + salva) · `GET /documents/:id/content?format=HTML` (preview)

**Por que é Strategy:**
O Strategy se aplica quando há múltiplos algoritmos intercambiáveis para resolver o mesmo problema e a escolha acontece em runtime. Aqui o "problema" é calcular uma pontuação de prioridade — mas WSJF e Eisenhower usam fórmulas completamente diferentes. Sem o pattern, o service teria um `if/switch` por algoritmo; cada novo método de priorização exigiria alterar o service (violação do Open/Closed Principle). Com o pattern, o service só chama `strategy.score(p)` e ignora qual algoritmo está rodando.

O mesmo raciocínio vale para geração de documentos: HTML, PDF e Markdown têm lógicas totalmente distintas, mas o service os trata de forma idêntica chamando `strategy.generate(data)`.

**Como foi feito:**
Interface TypeScript define contrato (`score` ou `generate`). O controller escolhe qual estratégia injetar com base no `format` da requisição e passa para o service. Adicionar novo formato = nova classe implementando a interface, zero mudança no service.

---

### 4. Observer Pattern

**Arquivos:**
- `apps/api/src/events/event-emitter.ts` — `appEmitter` (Singleton)
- `apps/api/src/services/notification.service.ts` — `registerListeners()`

**Eventos emitidos:**

| Evento | Quando |
|---|---|
| `task:status_changed` | Status de tarefa muda |
| `task:assigned` | Tarefa atribuída a usuário |
| `task:due_soon` | Tarefa próxima do vencimento (cron/job) |

**O que faz:**
Services emitem eventos sem saber quem vai ouvir. `NotificationService` registra listeners que persistem notificações no banco para cada usuário afetado.

**Por que é Observer:**
O Observer se aplica quando um evento em um domínio deve disparar reações em outros domínios sem que o emissor conheça os receptores — desacoplamento entre publisher e subscriber. Aqui `TaskService` emite `task:assigned` após atribuir uma tarefa; ele não sabe (e não deve saber) que isso vai gerar uma notificação. `NotificationService` registra o listener de forma independente.

Sem o pattern, `TaskService` teria que importar `NotificationService` diretamente e chamar `notificationService.create(...)` — acoplamento direto entre domínios. Com o Observer, adicionar um novo efeito colateral (ex: mandar e-mail, atualizar métricas) exige apenas um novo listener no `appEmitter`, sem tocar em `TaskService`.

**Como foi feito:**
`appEmitter` é o EventEmitter nativo do Node.js exposto como Singleton. Em `server.ts`, `notificationService.registerListeners()` é chamado no bootstrap — registra os handlers antes de o servidor aceitar requisições.

```
// emissor (TaskService)
appEmitter.emit('task:assigned', { taskId, assigneeId })

// ouvinte (NotificationService.registerListeners)
appEmitter.on('task:assigned', async ({ taskId, assigneeId }) => {
  await this.repo.create({ userId: assigneeId, ... })
})
```

---

## Pacotes e Apps

### Estrutura do Monorepo

```
devflow/                    ← root (pnpm workspace)
├── apps/
│   ├── api/                ← backend (devflow-backend)
│   └── web/                ← frontend (devflow-front)
├── packages/
│   └── types/              ← @devflow/types (tipos compartilhados)
└── Back/prisma/            ← diretório legado do backend
```

---

### `apps/api` — Backend API

**Nome:** `devflow-backend`  
**Stack:** Node.js · Express · TypeScript · Prisma ORM · PostgreSQL · Jest

**O que faz:**
API REST que serve o frontend. Gerencia tarefas, documentos, componentes, usuários, RBAC, notificações e configurações do sistema.

**Como rodar:**
```bash
cd apps/api
npm run dev              # dev com hot reload (ts-node-dev)
npm run build            # compila TypeScript → dist/
npm start                # inicia dist/server.js
npm run typecheck        # tsc --noEmit (zero erros obrigatório)
npm test                 # jest --runInBand --forceExit
npm run test:watch       # jest em modo watch
```

**Banco de dados:**
```bash
npm run db:push          # sincroniza schema sem criar migration
npm run prisma:migrate   # cria e aplica migration
npm run prisma:seed      # popula dados iniciais (RBAC, configs)
npm run prisma:studio    # abre Prisma Studio no browser
npm run reset:db         # ⚠️ DESTRUTIVO — apaga e recria banco
```

**Dependências principais:**

| Pacote | Propósito |
|---|---|
| `express` | Framework HTTP |
| `@prisma/client` | ORM — acesso ao PostgreSQL |
| `jsonwebtoken` | JWT para auth (access + refresh tokens) |
| `bcryptjs` | Hash de senhas |
| `zod` | Validação de schemas no corpo das requisições |
| `cors` | Configura CORS para o frontend |
| `dotenv` | Carrega variáveis de ambiente de `.env` |
| `@devflow/types` | Tipos/enums compartilhados (workspace) |

**DevDependencies principais:**

| Pacote | Propósito |
|---|---|
| `ts-node-dev` | Hot reload em dev sem compilar |
| `typescript` | Compilador TS |
| `jest` + `ts-jest` | Testes unitários/integração |
| `supertest` | Testa rotas HTTP sem subir servidor real |
| `prisma` | CLI do Prisma (migrations, seed, studio) |

---

### `apps/web` — Frontend

**Nome:** `devflow-front`  
**Stack:** React 18 · Vite · Tailwind CSS · Axios · Recharts

**O que faz:**
SPA com Kanban, priorização, documentação, componentes reutilizáveis, dashboard de custos, RBAC e notificações em tempo real (polling).

**Como rodar:**
```bash
cd apps/web
npm run dev          # Vite dev server (HMR)
npm run build        # build de produção → dist/
npm run preview      # preview do build de produção
```

**Dependências principais:**

| Pacote | Propósito |
|---|---|
| `react` + `react-dom` | UI declarativa com componentes |
| `axios` | HTTP client — chama a API com interceptor de JWT refresh |
| `recharts` | Gráficos no Dashboard (burndown, pizza, barras) |
| `react-syntax-highlighter` | Highlight de código em `ComponentDetail` |
| `@devflow/types` | Tipos/enums compartilhados (workspace) |

**DevDependencies principais:**

| Pacote | Propósito |
|---|---|
| `vite` | Bundler/dev server ultra-rápido |
| `@vitejs/plugin-react` | Suporte a JSX e Fast Refresh |
| `tailwindcss` | CSS utilitário (dark mode via classe `dark`) |
| `postcss` + `autoprefixer` | Processamento de CSS para Tailwind |

---

### `packages/types` — Tipos Compartilhados

**Nome:** `@devflow/types`  
**Stack:** TypeScript puro (sem runtime)

**O que faz:**
Biblioteca de tipos, enums e DTOs compartilhados entre `apps/api` e `apps/web`. Garante que backend e frontend usem os mesmos contratos de dados sem duplicação.

**Como rodar:**
```bash
cd packages/types
npm run build        # tsc → dist/ (necessário antes de usar nos apps)
npm run dev          # tsc --watch (rebuild automático em dev)
```

**Conteúdo de `src/index.ts`:**

| Export | Tipo | Descrição |
|---|---|---|
| `Role` | enum | GERENTE, LIDER, DESENVOLVEDOR, QA |
| `TaskStatus` | enum | BACKLOG → CONCLUIDO |
| `TaskPriority` | enum | CRITICA, ALTA, MEDIA, BAIXA |
| `DocType` / `DocFormat` / `DocStatus` | enum | Tipos de documento |
| `Quadrant` | enum | FAZER, AGENDAR, DELEGAR, ELIMINAR |
| `JwtPayload` | interface | `{ userId, role }` — payload do JWT |
| `UserDTO` | interface | Dados de usuário retornados pela API |
| `TaskDTO` | interface | Tarefa com priorização opcional |
| `DocumentDTO` | interface | Documento técnico |
| `RolePermissionDTO` | interface | Permissão RBAC |
| `NotificationDTO` | interface | Notificação persistida |
| `CostBreakdownDTO` | interface | Dados do dashboard de custos |

**Como foi feito:**
Enums espelham os enums do Prisma schema — mantidos em sync manualmente. Ao alterar o schema Prisma, os enums aqui devem ser atualizados também. Referenciado nos `package.json` dos apps como `"@devflow/types": "workspace:*"` (pnpm workspace protocol).

---

## Variáveis de Ambiente

Criar `apps/api/.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/devflow"
JWT_SECRET="seu_secret_aqui"
JWT_REFRESH_SECRET="seu_refresh_secret_aqui"
PORT=3000
```
