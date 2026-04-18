# DevFlow — Guia para Claude Code

## Visão Geral

Monorepo com frontend React (Vite) e backend Node.js/Express/Prisma/TypeScript.

- **Frontend**: `Front/` — React 18, Vite, Tailwind CSS (dark mode via classe)
- **Backend**: `Back/prisma/` — Node.js, Express, TypeScript, Prisma ORM, PostgreSQL

## Comandos Principais

### Backend
```bash
cd Back/prisma
npm run dev          # servidor dev com hot reload
npm run typecheck    # tsc --noEmit (zero erros exigido)
npm run build        # compilação produção
npm test             # jest
npx prisma db push   # sincroniza schema com o banco
```

### Frontend
```bash
cd Front
npm run dev          # vite dev server
npm run build        # produção
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
├── middlewares/     # auth, error, role, rbac (dinâmico), validate
├── validators/      # schemas Zod por domínio
└── utils/           # asyncHandler, errors, ownership
```

## Arquitetura do Frontend

```
src/
├── context/         # AuthContext, ThemeContext (dark/light + localStorage)
├── components/
│   ├── config/           # ProfileSettings, TeamSettings, RolePermissions (GERENTE)
│   ├── dashboard/        # SummaryCards (custo real), CostBreakdown, charts
│   ├── kanban/           # KanbanCard, KanbanColumn, NewTaskModal (Priorização embutida)
│   ├── priorizacao/      # EisenhowerMatrix, PriorityRanking, ValueEffortChart
│   ├── componentes/      # BibliotecaTab, ComponentModal, ComponentDetail (syntax highlight)
│   ├── documentacao/     # DocList, AutoGenPanel (sourceCode→HTML), VersionHistory (restore)
│   └── NotificationBell.jsx  # sino com polling 30s
├── services/        # api.js (axios + JWT refresh)
└── utils/           # taskMapper (mapeia /api/tasks para Kanban + Priorização)
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

## Regras

- `npm run typecheck` deve ter zero erros antes de qualquer commit
- Nunca quebrar rotas existentes da API
- Controllers → Services → Repositories: nenhum `prisma.*` em controller ou service diretamente
- Services aceitam repository via construtor — use o default singleton em produção
- Todas as novas permissões no frontend devem ser baseadas em `rbacService.check()` no backend,
  não em switches hardcoded por role
