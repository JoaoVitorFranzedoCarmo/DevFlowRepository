# DevFlow — Guia para Claude Code

## Visão Geral

Monorepo com frontend React (Vite) e backend Node.js/Express/Prisma/TypeScript.

- **Frontend**: `Front/` — React 18, Vite, Tailwind CSS (dark mode via classe)
- **Backend**: `Back/prisma/` — Node.js, Express, TypeScript, Prisma ORM, PostgreSQL

## Comandos Principais

### Backend
```bash
cd Back/prisma
npm run dev              # servidor dev com hot reload (ts-node-dev)
npm run typecheck        # tsc --noEmit (zero erros exigido)
npm run build            # compilação produção
npm test                 # jest --runInBand --forceExit
npm run test:watch       # jest em modo watch
npm run db:push          # prisma db push — sincroniza schema sem migration
npm run prisma:migrate   # prisma migrate dev — cria e aplica migration
npm run prisma:seed      # prisma db seed
npm run prisma:studio    # abre Prisma Studio na web
npm run reset:db         # prisma migrate reset --force (DESTRUTIVO)
```

### Frontend
```bash
cd Front
npm run dev          # vite dev server
npm run build        # produção
npm run preview      # preview do build de produção
```

## Arquitetura do Backend

```
Back/prisma/src/
├── app.ts                # Express setup: CORS, rotas, errorMiddleware
├── server.ts             # Bootstrap: seed RBAC, registerListeners, sobe servidor
├── config/               # database.ts (Singleton PrismaClient), env.ts (vars tipadas)
├── controllers/          # handlers HTTP — leem req, chamam service, escrevem res
│                         # auth, task, document, component, lesson, template,
│                         # integration, notification, rbac, user, system-config
├── services/             # lógica de negócio — orquestra repositories e eventos
│                         # (mesmos 11 domínios)
├── repositories/         # acesso a dados — toda chamada Prisma passa por aqui
│                         # task, document, component, user, notification,
│                         # role-permission, refresh-token, system-config,
│                         # lesson, template, integration
├── strategies/
│   ├── prioritization.strategy.ts      # WSJFStrategy, EisenhowerStrategy
│   └── document-generation.strategy.ts # HtmlGenerationStrategy, PdfGenerationStrategy,
│                                        # MarkdownGenerationStrategy
├── events/
│   └── event-emitter.ts  # appEmitter singleton (Observer Pattern)
├── routes/               # 12 arquivos de rotas + index.ts (agrega sob /api)
├── middlewares/          # auth, error, role (legado + requirePermission dinâmico), validate
├── validators/           # schemas Zod: auth, task, document, component, lesson,
│                         # template, integration, notification, user
└── utils/                # asyncHandler, errors (AppError hierarchy), ownership
```

## Arquitetura do Frontend

```
src/
├── App.jsx / main.jsx
├── index.css
├── context/
│   ├── AuthContext.jsx       # JWT, login, logout, refresh token
│   └── ThemeContext.jsx      # dark/light + localStorage + matchMedia fallback
├── pages/
│   ├── LoginPage.jsx
│   └── RegisterPage.jsx
├── components/               # componentes de página (top-level)
│   ├── DashboardPage.jsx
│   ├── KanbanPage.jsx
│   ├── PriorizacaoPage.jsx
│   ├── DocumentacaoPage.jsx
│   ├── ComponentesPage.jsx
│   ├── ConfigPage.jsx
│   ├── Sidebar.jsx
│   ├── Topbar.jsx            # toggle de tema + NotificationBell
│   ├── NotificationBell.jsx  # polling 30s, badge unreadCount
│   ├── config/               # ProfileSettings, TeamSettings, RolePermissions (GERENTE only)
│   ├── dashboard/            # SummaryCards, CostBreakdown, BurndownChart, TasksChart,
│   │                         # TaskDistributionChart, SprintHeader, TopComponents
│   ├── kanban/               # KanbanCard, KanbanColumn, KanbanHeader, NewTaskModal
│   ├── priorizacao/          # EisenhowerMatrix, PriorityRanking, ValueEffortChart,
│   │                         # DependencyMap, PrioritySummary
│   ├── componentes/          # BibliotecaTab, LicoesTab, ComponentCard, ComponentModal,
│   │                         # ComponentDetail (syntax highlight), StarRating, StatsBar
│   └── documentacao/         # DocList, DocSummary, AutoGenPanel (sourceCode→HTML),
│                              # VersionHistory (restore), NewDocModal, TemplateGrid
├── icons/
│   └── SidebarIcons.jsx
├── services/
│   └── api.js                # axios + JWT refresh interceptor
├── data/                     # dados estáticos/mock por domínio
│   ├── mockData.js
│   ├── dashboardData.js
│   ├── kanbanData.js
│   ├── priorizacaoData.js
│   ├── documentacaoData.js
│   └── configData.js
└── utils/
    └── taskMapper.js         # mapeia /api/tasks → quadrantKey + score (Kanban + Priorização)
```

## Design Patterns Implementados

### 1. Singleton
**Onde**: `src/config/database.ts` e `src/events/event-emitter.ts`
- `database.ts`: `globalThis` evita múltiplas instâncias do PrismaClient durante hot reload
- `event-emitter.ts`: EventEmitter global único — preservado entre recargas em dev

### 2. Repository Pattern
**Onde**: `src/repositories/`
- `TaskRepository` — encapsula `prisma.task.*`, `prisma.taskPrioritization.*`, `prisma.taskDependency.*`
- `ComponentRepository`, `DocumentRepository`, `NotificationRepository`, `UserRepository`,
  `RolePermissionRepository`, `CustomRoleRepository` — todos os acessos Prisma passam por aqui
- Services recebem o repository via construtor (injeção de dependência)

### 3. Strategy Pattern
**Onde**: `src/strategies/`
- `PrioritizationStrategy.score(p): number`
  - `WSJFStrategy`: `(value × importance × urgency) / effort` — padrão
  - `EisenhowerStrategy`: `urgency × importance`
- `DocumentGenerationStrategy.generate(data): string`
  - `HtmlGenerationStrategy`, `PdfGenerationStrategy`, `MarkdownGenerationStrategy`
  - Usado em `POST /documents/:id/generate` (gera+salva) e `GET /documents/:id/content?format=HTML` (preview)

### 4. Observer Pattern
**Onde**: `src/events/event-emitter.ts` + `services/notification.service.ts`
- Eventos: `task:status_changed`, `task:assigned`, `task:due_soon`
- `NotificationService.registerListeners()` escuta e persiste notificações por usuário

## Funcionalidades-Chave

### Priorização compartilhada com Kanban
- Ambas as telas consomem `/api/tasks` e compartilham `NewTaskModal` via prop `showPrioritization`
- Mapper `Front/src/utils/taskMapper.js` deriva `quadrantKey` (fazer/agendar/delegar/eliminar) e `score`

### Dashboard — custo estimado real
- `GET /tasks/dashboard/cost` retorna `{ totalCost, totalHours, hourlyRate, byAssignee, bySprint }`
- Cálculo: `estimatedHours × multiplicadorPrioridade × hourlyRate`
  (CRITICA=4, ALTA=3, MEDIA=2, BAIXA=1; hourlyRate padrão R$ 50/h)

### Documentação — geração e versionamento
- `POST /documents/:id/generate` recebe `{ sourceCode, format, commit, changes }` → gera HTML estruturado
  via strategy, salva em `Document.content`, cria nova `DocumentVersion` e incrementa versão
- `POST /documents/:id/versions/:versionId/restore` restaura conteúdo de versão anterior
  (cria backup automático da versão atual antes)
- Frontend tem modal de preview HTML (iframe srcDoc) em `DocList.jsx` e `AutoGenPanel.jsx`

### RBAC dinâmico
- Modelos: `CustomRole` + `RolePermission` (roleName × module × action)
- `roleMiddleware` consulta o banco via `rbacService.check(role, module, action)`
- Tela `Front/src/components/config/RolePermissions.jsx` (tab visível só para GERENTE) permite
  criar cargos customizados e alternar permissões em matriz

### Tema claro/escuro
- `ThemeContext` com localStorage + `matchMedia` fallback
- Aplica classe `dark` na raiz do HTML; Tailwind usa `darkMode: "class"`
- Toggle na Topbar

### Notificações
- `NotificationBell` em Topbar faz polling a cada 30s em `/notifications/feed`
- Badge com `unreadCount`, dropdown marca como lida ao clicar

## Modelos Prisma

**Enums:** `Role` (GERENTE, LIDER, DESENVOLVEDOR, QA) · `TaskStatus` (BACKLOG, AFAZER, PROGRESSO, REVISAO, CONCLUIDO) · `TaskPriority` (CRITICA, ALTA, MEDIA, BAIXA) · `DocType` (OPENAPI, TECNICA, MANUAL) · `DocFormat` (HTML, PDF, MARKDOWN) · `DocStatus` (ATUALIZADO, DESATUALIZADO, RASCUNHO) · `Quadrant` (FAZER, AGENDAR, DELEGAR, ELIMINAR)

| Modelo | Propósito |
|---|---|
| `User` | Usuário com role fixa e vínculo opcional a `CustomRole` |
| `RefreshToken` | Tokens de refresh com expiração |
| `Task` | Tarefa do Kanban (status, prioridade, assignee, estimatedHours) |
| `TaskPrioritization` | Dados WSJF/Eisenhower 1:1 com Task |
| `TaskDependency` | Muitos-para-muitos entre tarefas |
| `Document` | Documento técnico com versionamento e sourceCode |
| `DocumentVersion` | Snapshot imutável por versão |
| `Component` | Componente reutilizável com codeSnippet, rating, uses |
| `Lesson` | Lição aprendida por projeto |
| `Template` | Template de documento com contador de uso |
| `Integration` | Integração externa por usuário (com status toggle) |
| `Notification` | Notificação persistida (index em `[userId, read]`) |
| `NotificationSetting` | Preferências por evento e canal (email/push) |
| `CustomRole` | Cargo personalizado criado pelo Gerente |
| `RolePermission` | roleName × module × action × allowed |
| `SystemConfig` | Configurações chave-valor (hourlyRate, tema padrão) |

## Regras

- `npm run typecheck` deve ter zero erros antes de qualquer commit
- Nunca quebrar rotas existentes da API
- Controllers → Services → Repositories: nenhum `prisma.*` em controller ou service diretamente
- Services aceitam repository via construtor — use o default singleton em produção
- Todas as novas permissões no frontend devem ser baseadas em `rbacService.check()` no backend,
  não em switches hardcoded por role
