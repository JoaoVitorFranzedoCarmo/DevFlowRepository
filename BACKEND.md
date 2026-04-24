# Backend — Arquitetura e Design Patterns

## Visão Geral

O backend é uma API REST em **Node.js + Express + TypeScript** com **Prisma ORM** e banco **PostgreSQL**. A arquitetura segue separação estrita de camadas e aplica quatro design patterns clássicos: **Singleton**, **Repository**, **Strategy** e **Observer**.

---

## Estrutura de Diretórios

```
Back/prisma/src/
├── app.ts                  # Configuração do Express (CORS, rotas, erros)
├── server.ts               # Bootstrap: seed RBAC, registra listeners, sobe servidor
│
├── config/
│   ├── database.ts         # Singleton do PrismaClient
│   └── env.ts              # Variáveis de ambiente tipadas
│
├── controllers/            # Camada HTTP — lê req, chama service, escreve res
├── services/               # Lógica de negócio — orquestra repositories e eventos
├── repositories/           # Acesso a dados — toda chamada Prisma passa por aqui
├── strategies/             # Algoritmos intercambiáveis (Strategy Pattern)
├── events/                 # EventEmitter singleton (Observer Pattern)
├── middlewares/            # auth, error, role/RBAC, validate
├── routes/                 # Definição de rotas Express
├── validators/             # Schemas Zod por domínio
└── utils/                  # asyncHandler, classes de erro, ownership
```

---

## Camadas da Aplicação

### 1. Routes (`src/routes/`)

Ponto de entrada de cada domínio. Cada arquivo registra os middlewares na ordem correta (`auth → validate → controller`) e delega para o controller.

```
routes/
├── index.ts              # Agrega todas as rotas sob /api
├── auth.routes.ts
├── task.routes.ts
├── document.routes.ts
├── component.routes.ts
├── lesson.routes.ts
├── template.routes.ts
├── integration.routes.ts
├── notification.routes.ts
├── rbac.routes.ts
├── system-config.routes.ts
└── user.routes.ts
```

**Exemplo de rota — task:**
```
GET    /api/tasks                    → authMiddleware → findAll
POST   /api/tasks                    → authMiddleware → validate → create
PUT    /api/tasks/:id/prioritization → authMiddleware → validate → setPrioritization
POST   /api/tasks/:id/generate       → authMiddleware → validate → generateAndSave
```

---

### 2. Controllers (`src/controllers/`)

Responsabilidade única: ler `req`, chamar o service correspondente e escrever `res`. Nenhuma lógica de negócio aqui.

| Controller | Responsabilidade |
|---|---|
| `auth.controller.ts` | Register, login, refresh token, logout, /me |
| `task.controller.ts` | CRUD de tarefas, Kanban, priorização, dependências, dashboard/custo |
| `document.controller.ts` | CRUD, versões, restore, preview e geração de conteúdo |
| `component.controller.ts` | CRUD de componentes, stats |
| `lesson.controller.ts` | CRUD de lições aprendidas |
| `template.controller.ts` | CRUD de templates, incrementar usos |
| `integration.controller.ts` | CRUD de integrações, toggle de status |
| `notification.controller.ts` | Feed, marcar lida, preferências |
| `rbac.controller.ts` | Matriz de permissões, cargos customizados |
| `user.controller.ts` | Listagem e atualização de usuários |
| `system-config.controller.ts` | Configurações de sistema (hourly rate, tema) |

---

### 3. Services (`src/services/`)

Contém toda a lógica de negócio. Recebem o repository via construtor (injeção de dependência) e emitem/escutam eventos.

| Service | Destaque |
|---|---|
| `task.service.ts` | Cálculo de custo estimado (horas × multiplicador de prioridade × hourlyRate); emite `task:assigned`, `task:status_changed`, `task:due_soon` |
| `document.service.ts` | Delega geração de conteúdo para estratégias (Strategy Pattern); cria versões e faz restore com backup automático |
| `notification.service.ts` | Registra listeners no EventEmitter no startup; persiste notificações ao receber eventos |
| `rbac.service.ts` | Seed de permissões padrão, consulta dinâmica ao banco para `check(role, module, action)` |
| `auth.service.ts` | Hash de senha, geração de JWT access + refresh, armazenamento do refresh token no banco |

**Regra de custo em `task.service.ts`:**
```
custo = estimatedHours × multiplicador × hourlyRate
multiplicadores: CRITICA=4, ALTA=3, MEDIA=2, BAIXA=1
```

---

### 4. Repositories (`src/repositories/`)

Encapsulam **toda** interação com o Prisma. Services nunca chamam `prisma.*` diretamente.

```
repositories/
├── task.repository.ts            # findMany, upsertPrioritization, dependências, groupByStatus/Priority
├── document.repository.ts        # CRUD + versões, groupByStatus, sumPages
├── component.repository.ts       # CRUD + groupByCategory, aggregateUses
├── user.repository.ts            # CRUD + findByEmail (inclui senha), groupByRole
├── notification.repository.ts    # feed, markRead, upsertSetting, findPushSettingsByEvent
├── role-permission.repository.ts # check, upsert, findByRole, findByCustomRole
├── lesson.repository.ts
├── template.repository.ts
├── integration.repository.ts
├── refresh-token.repository.ts
└── system-config.repository.ts
```

---

### 5. Validators (`src/validators/`)

Schemas **Zod** por domínio. O middleware `validate(schema)` executa a validação antes do controller.

```
validators/
├── auth.validator.ts       # registerSchema, loginSchema, refreshTokenSchema
├── task.validator.ts       # createTaskSchema, taskPrioritizationSchema, moveTaskSchema, bulkDependenciesSchema
├── document.validator.ts   # createDocumentSchema, createDocVersionSchema, generateDocSchema
├── component.validator.ts
├── lesson.validator.ts
├── template.validator.ts
├── integration.validator.ts
├── notification.validator.ts
└── user.validator.ts
```

---

### 6. Utils (`src/utils/`)

| Arquivo | Responsabilidade |
|---|---|
| `asyncHandler.ts` | Wrapper para controllers async — captura rejeições e encaminha ao `errorMiddleware` |
| `errors.ts` | Hierarquia de erros: `AppError` → `NotFoundError (404)`, `BadRequestError (400)`, `UnauthorizedError (401)`, `ForbiddenError (403)`, `ConflictError (409)` |
| `ownership.ts` | `assertOwnership(ownerId, userId, role)` — lança `ForbiddenError` se o usuário não é dono nem GERENTE |

---

## Design Patterns

### Pattern 1 — Singleton

**Onde:** `src/config/database.ts` e `src/events/event-emitter.ts`

#### `database.ts` — PrismaClient Singleton

O Prisma cria um pool de conexões por instância. Em desenvolvimento com hot reload, o Node.js pode criar múltiplas instâncias quebrando o pool. A solução usa `globalThis` para preservar a instância entre recargas:

```typescript
// src/config/database.ts
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ log: ["query", "error"] });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
```

- Em produção: uma instância por processo.
- Em desenvolvimento: a instância é salva em `globalThis` e reutilizada a cada hot reload.

#### `event-emitter.ts` — EventEmitter Singleton

Mesmo princípio: um EventEmitter global único garante que os listeners registrados no startup não sejam perdidos ou duplicados durante recargas:

```typescript
// src/events/event-emitter.ts
const globalForEmitter = globalThis as unknown as { emitter?: EventEmitter };

export const appEmitter =
  globalForEmitter.emitter ?? new EventEmitter();

if (process.env.NODE_ENV !== "production") {
  globalForEmitter.emitter = appEmitter;
}
```

---

### Pattern 2 — Repository Pattern

**Onde:** `src/repositories/` (11 repositórios)

Todos os acessos ao banco são feitos exclusivamente via repositórios. Services recebem o repositório via construtor — isso desacopla a lógica de negócio do ORM e facilita testes (basta substituir o repositório por um mock).

```typescript
// src/services/task.service.ts
export class TaskService {
  constructor(
    private readonly repo: TaskRepository,       // injeção de dependência
    private readonly configRepo: SystemConfigRepository
  ) {}

  async findAll(filters?: TaskFilters) {
    return this.repo.findMany(filters);           // nunca chama prisma diretamente
  }
}

// uso em produção (singleton padrão)
export const taskService = new TaskService(
  new TaskRepository(),
  new SystemConfigRepository()
);
```

**Repositórios e suas operações-chave:**

| Repositório | Operações destacadas |
|---|---|
| `TaskRepository` | `upsertPrioritization`, `findTasksDueSoon(hours)`, `groupByStatus/Priority/Assignee` |
| `DocumentRepository` | `createVersion`, `findVersion`, `groupByStatus`, `sumPages` |
| `NotificationRepository` | `findByUser` (unread first), `findPushSettingsByEvent`, `createMany` |
| `RolePermissionRepository` | `checkPermission(roleName, module, action)` — boolean |
| `UserRepository` | `findByEmail` (inclui campo `password`), `findById` (sem senha) |

---

### Pattern 3 — Strategy Pattern

**Onde:** `src/strategies/`

Define uma interface comum e permite trocar o algoritmo em tempo de execução sem alterar o código que o usa.

#### Estratégias de Priorização — `prioritization.strategy.ts`

```typescript
interface PrioritizationStrategy {
  readonly name: string;
  score(p: TaskPrioritizationData): number;
}

class WSJFStrategy implements PrioritizationStrategy {
  name = "WSJF";
  score({ value, importance, urgency, effort }: TaskPrioritizationData) {
    return Math.round((value * importance * urgency) / Math.max(effort, 1) * 10) / 10;
  }
}

class EisenhowerStrategy implements PrioritizationStrategy {
  name = "Eisenhower";
  score({ urgency, importance }: TaskPrioritizationData) {
    return Math.round(urgency * importance * 10) / 10;
  }
}
```

Usado em `TaskService.getPrioritizedTasks()` — a estratégia é selecionada pelo parâmetro `strategy` da query e o resultado é ordenado pelo score calculado.

#### Estratégias de Geração de Documentos — `document-generation.strategy.ts`

```typescript
interface DocumentGenerationStrategy {
  readonly format: string;
  generate(data: DocumentData): string;
}

class HtmlGenerationStrategy implements DocumentGenerationStrategy {
  format = "HTML";
  generate(data) { /* extrai funções/classes via regex, gera HTML estilizado */ }
}

class PdfGenerationStrategy implements DocumentGenerationStrategy {
  format = "PDF";
  generate(data) { /* texto plano com separadores para conversão PDF */ }
}

class MarkdownGenerationStrategy implements DocumentGenerationStrategy {
  format = "MARKDOWN";
  generate(data) { /* Markdown com tabela de metadados e bloco de código */ }
}
```

Usado em `DocumentService` em dois pontos:

| Endpoint | Método | Descrição |
|---|---|---|
| `GET /documents/:id/content?format=HTML` | `generateContent` | Preview sem salvar |
| `POST /documents/:id/generate` | `generateAndSave` | Gera, salva em `content` e cria nova `DocumentVersion` |

```typescript
// src/services/document.service.ts
private getStrategy(format: string): DocumentGenerationStrategy {
  const strategies = {
    HTML:     new HtmlGenerationStrategy(),
    PDF:      new PdfGenerationStrategy(),
    MARKDOWN: new MarkdownGenerationStrategy(),
  };
  return strategies[format] ?? strategies.HTML;
}
```

---

### Pattern 4 — Observer Pattern

**Onde:** `src/events/event-emitter.ts` + `src/services/notification.service.ts`

O `appEmitter` (EventEmitter singleton) conecta produtores de eventos (TaskService) a consumidores (NotificationService) sem acoplamento direto.

#### Eventos disponíveis

| Evento | Payload | Quem emite | Quem escuta |
|---|---|---|---|
| `task:assigned` | `{ taskId, taskTitle, assigneeId }` | `TaskService.create / update` | `NotificationService` |
| `task:status_changed` | `{ taskId, taskTitle, oldStatus, newStatus, assigneeId }` | `TaskService.moveTask` | `NotificationService` |
| `task:due_soon` | `{ taskId, taskTitle, assigneeId, dueDate }` | `TaskService.checkDueSoon` | `NotificationService` |

#### Como funciona

**1. Emissão (TaskService):**
```typescript
// src/services/task.service.ts
async moveTask(id: string, status: TaskStatus) {
  const task = await this.repo.update(id, { status });
  appEmitter.emit("task:status_changed", {
    taskId: task.id,
    taskTitle: task.title,
    oldStatus: task.status,
    newStatus: status,
    assigneeId: task.assigneeId,
  });
  return task;
}
```

**2. Registro de listeners (NotificationService no bootstrap):**
```typescript
// src/services/notification.service.ts
registerListeners() {
  appEmitter.on("task:status_changed", (event) => this.handleTaskStatusChanged(event));
  appEmitter.on("task:assigned",       (event) => this.handleTaskAssigned(event));
  appEmitter.on("task:due_soon",       (event) => this.handleTaskDueSoon(event));
}
```

**3. Persistência da notificação:**
```typescript
async handleTaskStatusChanged(event) {
  if (!event.assigneeId) return;
  await this.repo.create({
    userId: event.assigneeId,
    type: "STATUS_CHANGED",
    message: `Tarefa "${event.taskTitle}" movida para ${event.newStatus}`,
    link: `/kanban`,
  });
}
```

O `NotificationService.registerListeners()` é chamado em `server.ts` durante o bootstrap, antes de o servidor começar a aceitar requisições.

---

## Middlewares

| Middleware | Arquivo | Responsabilidade |
|---|---|---|
| `authMiddleware` | `auth.middleware.ts` | Valida Bearer JWT; injeta `req.user = { userId, role }` |
| `roleMiddleware` | `role.middleware.ts` | Modo legado: verifica `req.user.role` contra roles permitidas |
| `requirePermission` | `role.middleware.ts` | Modo dinâmico: consulta `rbacService.check(role, module, action)` no banco |
| `validate(schema)` | `validate.middleware.ts` | Executa schema Zod em `req.body`; lança `ZodError` se inválido |
| `validateQuery(schema)` | `validate.middleware.ts` | Executa schema Zod em `req.query` |
| `errorMiddleware` | `error.middleware.ts` | Captura todos os erros: `AppError` → statusCode/message; `ZodError` → 400 com campos; demais → 500 |

---

## Fluxo de uma Requisição

```
Cliente
  │
  ▼
Router (routes/)
  │  define middlewares e delega
  ▼
authMiddleware → injeta req.user
  │
  ▼
validate(schema) → valida req.body com Zod
  │
  ▼
Controller (controllers/)
  │  lê req, chama service
  ▼
Service (services/)
  │  lógica de negócio, chama repository e/ou emite evento
  ▼
Repository (repositories/)
  │  chamada Prisma → banco PostgreSQL
  ◄
Service
  │  (opcionalmente) appEmitter.emit(...)
  │                        │
  │                        ▼
  │               NotificationService
  │               (persiste notificação via repo)
  ◄
Controller
  │  escreve res.json(...)
  ▼
Cliente
```

---

## RBAC (Controle de Acesso Baseado em Função)

O sistema suporta **roles fixas** (GERENTE, LIDER, DESENVOLVEDOR, QA) e **cargos customizados** criados pelo Gerente em tempo de execução.

- **Permissões** são armazenadas na tabela `RolePermission` (roleName × module × action × allowed).
- `RbacService.seedDefaults()` popula a matriz padrão no startup.
- `requirePermission("kanban", "editar")` consulta o banco via `RolePermissionRepository.checkPermission()`.
- A tela `RolePermissions.jsx` (visível só para GERENTE) consome `GET /rbac/matrix` e atualiza via `PUT /rbac/permissions/bulk`.

**Módulos:** dashboard, kanban, priorizacao, documentacao, componentes, configuracoes  
**Ações:** visualizar, criar, editar, deletar

---

## Modelos Prisma (resumo)

| Modelo | Propósito |
|---|---|
| `User` | Usuário com role e vínculo opcional a `CustomRole` |
| `RefreshToken` | Tokens de refresh armazenados com expiração |
| `Task` | Tarefa do Kanban com status, prioridade e assignee |
| `TaskPrioritization` | Dados WSJF/Eisenhower (1:1 com Task) |
| `TaskDependency` | Relação muitos-para-muitos entre tarefas (com unique constraint) |
| `Document` | Documento técnico com versionamento |
| `DocumentVersion` | Snapshot imutável de cada versão do documento |
| `Component` | Componente reutilizável com snippet de código |
| `Lesson` | Lição aprendida por projeto |
| `Template` | Templates de documento com contador de uso |
| `Integration` | Integração externa por usuário |
| `Notification` | Notificação persistida por usuário (com index em `[userId, read]`) |
| `NotificationSetting` | Preferências de notificação por evento e canal |
| `CustomRole` | Cargo personalizado criado pelo Gerente |
| `RolePermission` | Permissão granular por role × módulo × ação |
| `SystemConfig` | Configurações chave-valor (hourly rate, tema padrão) |
