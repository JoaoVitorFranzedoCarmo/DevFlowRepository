# DevFlow — Design Patterns & Pacotes

## Design Patterns

### 1. Singleton

**Arquivos:**
- `apps/api/src/config/database.ts`
- `apps/api/src/events/event-emitter.ts`

**O que faz:**
Garante que apenas uma instância de um objeto exista em toda a aplicação, compartilhada por todos os módulos que precisam dela.

**Por que é Singleton:**
O Singleton se aplica quando criar mais de uma instância quebraria o comportamento do sistema. Aqui há dois casos concretos:

- `PrismaClient` gerencia um **connection pool** com o PostgreSQL. O banco aceita um número fixo de conexões simultâneas. Se cada módulo criasse `new PrismaClient()` separado, cada um abriria seu próprio pool — conexões esgotadas rapidamente, erros em produção.
- `EventEmitter` é o barramento central de eventos. Se cada módulo criasse o próprio `EventEmitter`, um listener registrado em um não receberia eventos emitidos em outro. O Observer Pattern (seção 4) dependente disso quebraria silenciosamente.

**Como foi feito:**
`ts-node-dev` (hot reload em dev) recarrega módulos a cada mudança de arquivo, mas **não reinicia o processo Node**. Sem proteção, cada reload criaria nova instância. `globalThis` é o objeto global do processo — sobrevive a reloads de módulo.

```typescript
// database.ts
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
const prisma = globalForPrisma.prisma || new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
export default prisma
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
Isola toda lógica de acesso a dados atrás de uma classe. Nenhum `prisma.*` aparece em controllers ou services diretamente — eles só chamam métodos do repositório.

**Por que é Repository:**
Sem o pattern, services misturariam lógica de negócio com queries Prisma. O acoplamento causaria dois problemas:

1. **Testes difíceis**: testar um service exigiria banco real. Com repositório, basta passar um mock com os mesmos métodos — sem banco, sem lentidão em CI.
2. **Queries espalhadas**: um `include` complexo repetido em 3 services vira 3 lugares para corrigir se o schema mudar. Com repositório, fica num só lugar.

**Como foi feito:**
Cada repositório é uma classe que usa o `prisma` singleton. Services recebem o repositório via construtor — em produção usa o singleton exportado, em testes recebe um mock.

```typescript
// controller → service → repository → prisma
class TaskService {
  constructor(private repo: TaskRepository = taskRepository) {}

  async create(data) {
    return this.repo.create(data)  // service não sabe que usa Prisma
  }
}

// no teste:
const mockRepo = { create: jest.fn().mockResolvedValue({ id: 1 }) }
const service = new TaskService(mockRepo as any)
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
| `PdfGenerationStrategy` | Texto formatado (PDF-like) |
| `MarkdownGenerationStrategy` | Markdown com frontmatter |

Usado em: `POST /documents/:id/generate` (gera + salva) · `GET /documents/:id/content?format=HTML` (preview)

**Por que é Strategy:**
O Strategy se aplica quando há múltiplos algoritmos para resolver o mesmo problema e a escolha acontece em runtime (com base numa entrada do usuário, por exemplo).

Sem o pattern, o service teria um `if/switch` gigante:

```typescript
// SEM Strategy — ruim
async generate(docId, format) {
  if (format === 'HTML') {
    // 50 linhas de geração HTML
  } else if (format === 'PDF') {
    // 40 linhas de geração PDF
  } else if (format === 'MARKDOWN') {
    // 30 linhas de Markdown
  }
  // adicionar ASCIIDOC = editar este arquivo
}
```

Com o pattern, adicionar novo formato = nova classe, zero mudança no service:

```typescript
// COM Strategy — limpo
async generate(docId, format) {
  const strategy = getStrategy(format)  // escolhe HTML, PDF ou MD
  const content = strategy.generate(data)  // service não sabe qual é
  await this.repo.update(docId, { content })
}

// adicionar ASCIIDOC: nova classe AsciidocGenerationStrategy, só isso
```

**Como foi feito:**
Interface TypeScript define o contrato (`score` ou `generate`). O controller lê o `format` da requisição, instancia a estratégia correta e injeta no service.

---

### 4. Observer Pattern

**Arquivos:**
- `apps/api/src/events/event-emitter.ts` — `appEmitter` (barramento de eventos, Singleton)
- `apps/api/src/services/notification.service.ts` — `registerListeners()` (ouvintes)

**Eventos no sistema:**

| Evento | Quem emite | Quando |
|---|---|---|
| `task:status_changed` | `TaskService` | Status de tarefa muda |
| `task:assigned` | `TaskService` | Tarefa atribuída a usuário |
| `task:due_soon` | job agendado | Tarefa próxima do vencimento |

**O problema que resolve — acoplamento entre domínios:**

Sem Observer, `TaskService` precisaria chamar `NotificationService` diretamente:

```typescript
// SEM Observer — TaskService conhece NotificationService
import { notificationService } from "./notification.service"

class TaskService {
  async assign(taskId, userId) {
    await this.repo.update(taskId, { assigneeId: userId })

    // TaskService agora depende de NotificationService
    await notificationService.create({ userId, message: "você foi atribuído..." })
    // e se precisar de e-mail também? importa EmailService aqui?
    // e métricas? e Slack? TaskService vira um Frankenstein
  }
}
```

**Com Observer — TaskService não sabe quem reage:**

```typescript
// TaskService só anuncia o que aconteceu
class TaskService {
  async assign(taskId, userId) {
    await this.repo.update(taskId, { assigneeId: userId })
    appEmitter.emit('task:assigned', { taskId, assigneeId: userId })
    // acabou. TaskService não sabe que existe NotificationService.
  }
}
```

```typescript
// NotificationService "cola o ouvido" no barramento — independente
class NotificationService {
  registerListeners() {
    // .on() = "quero ouvir este evento"
    appEmitter.on('task:assigned', (event) => {
      // recebe o evento e salva notificação no banco
      this.repo.create({ userId: event.assigneeId, message: "você foi atribuído..." })
    })
  }
}
```

**O que são listeners:**
`.on('evento', fn)` registra uma função que fica "aguardando". Quando `.emit('evento', dados)` dispara em qualquer parte do código, Node.js chama automaticamente todas as funções registradas com `.on` para aquele evento, passando os dados. É como uma inscrição — você se inscreve num evento e recebe a chamada quando ele acontece.

**Vantagem concreta:** amanhã você quer mandar e-mail quando tarefa é atribuída. Não toca em `TaskService`. Só adiciona:

```typescript
appEmitter.on('task:assigned', (event) => {
  emailService.send(event.assigneeId, "você foi atribuído")
})
```

**Como foi feito:**
`appEmitter` é o `EventEmitter` nativo do Node.js, exposto como Singleton via `globalThis`. Em `server.ts`, `notificationService.registerListeners()` é chamado no bootstrap — registra todos os `.on()` antes de o servidor aceitar requisições.

---

## Pacotes e Apps

### Estrutura do Monorepo

```
devflow/                    ← root (pnpm workspace)
├── apps/
│   ├── api/                ← backend REST (Node.js + Express + Prisma)
│   └── web/                ← frontend SPA (React + Vite)
└── packages/
    └── types/              ← @devflow/types (contratos TypeScript compartilhados)
```

**Por que monorepo com pnpm workspaces?**
Frontend e backend compartilham os mesmos tipos (enums, interfaces). Sem monorepo, seriam dois repositórios separados e os tipos estariam duplicados — uma mudança no backend exigiria atualizar o frontend manualmente, com risco de dessincronia. O `workspace:*` do pnpm conecta os pacotes internamente sem publicar no npm.

---

### `apps/api` — Backend REST

**Nome do pacote:** `devflow-backend`
**Stack:** Node.js · Express · TypeScript · Prisma ORM · PostgreSQL · Jest · Zod

**Por que foi feito:**
É a camada de servidor que expõe a API REST consumida pelo frontend. Responsável por autenticação JWT, controle de acesso (RBAC), persistência no banco e disparo de notificações. Sem ele, o frontend não teria dados reais — tudo seria mock.

**O que faz:**
- Autentica usuários com JWT (access token curto + refresh token longo)
- Gerencia tarefas, documentos, componentes, templates, lições aprendidas
- Calcula scores de priorização (WSJF / Eisenhower)
- Gera documentação em HTML/PDF/Markdown a partir de código-fonte
- Controla permissões por cargo via RBAC dinâmico no banco
- Emite eventos para o sistema de notificações (Observer)

**Como rodar:**

Pré-requisito: PostgreSQL rodando e `apps/api/.env` configurado (ver seção Variáveis de Ambiente).

```bash
cd apps/api

# Primeira vez
npm run prisma:migrate   # cria tabelas no banco
npm run prisma:seed      # popula dados iniciais (cargos, configs)

# Dev diário
npm run dev              # hot reload com ts-node-dev

# Verificações
npm run typecheck        # TypeScript sem erros (obrigatório antes de commit)
npm test                 # testes com Jest

# Banco
npm run prisma:studio    # interface visual do banco no browser
npm run db:push          # sincroniza schema sem migration (prototipagem)
npm run reset:db         # ⚠️ DESTRUTIVO — apaga tudo e recria
```

**Dependências e por que cada uma:**

| Pacote | Por que foi escolhido |
|---|---|
| `express` | Framework HTTP minimalista — rotas, middlewares, JSON out-of-the-box |
| `@prisma/client` | ORM type-safe — queries com autocomplete TypeScript, migrations, seed |
| `jsonwebtoken` | Assina e verifica JWTs — access token (15min) + refresh token (7d) |
| `bcryptjs` | Hash de senha com salt — não armazena senha em texto plano |
| `zod` | Valida o corpo das requisições antes de chegar no service — erros claros ao cliente |
| `cors` | Permite que o frontend (porta 5173) chame a API (porta 3000) |
| `dotenv` | Carrega `DATABASE_URL`, `JWT_SECRET` etc. do arquivo `.env` |
| `@devflow/types` | Enums e interfaces do monorepo — sem duplicar tipos entre back e front |

| DevDependency | Por que foi escolhido |
|---|---|
| `ts-node-dev` | Roda TypeScript direto em dev com hot reload — sem compilar manualmente |
| `typescript` | Tipagem estática — pega erros em tempo de build, não em produção |
| `jest` + `ts-jest` | Framework de testes — `ts-jest` permite testar arquivos `.ts` direto |
| `supertest` | Faz requisições HTTP nos testes sem precisar subir o servidor |
| `prisma` (CLI) | Roda `migrate`, `seed`, `studio` — ferramentas de banco em desenvolvimento |

---

### `apps/web` — Frontend SPA

**Nome do pacote:** `devflow-front`
**Stack:** React 18 · Vite · Tailwind CSS · Axios · Recharts

**Por que foi feito:**
É a interface do usuário. Consome a API do backend e apresenta Kanban, priorização, documentação, biblioteca de componentes e dashboard de métricas. Sem ele, a API existiria mas ninguém conseguiria usar o sistema sem chamadas manuais.

**O que faz:**
- Kanban com drag-and-drop de status (BACKLOG → CONCLUÍDO)
- Matriz de priorização Eisenhower e ranking WSJF
- Geração e versionamento de documentação técnica
- Dashboard com gráficos de custo, burndown e distribuição de tarefas
- Controle de acesso visual baseado no RBAC do backend
- Notificações em tempo real via polling a cada 30s
- Tema claro/escuro com preferência salva no localStorage

**Como rodar:**

Pré-requisito: `apps/api` rodando na porta 3000.

```bash
cd apps/web

npm run dev        # Vite dev server com HMR (Hot Module Replacement)
npm run build      # gera dist/ otimizado para produção
npm run preview    # testa o build de produção localmente
```

**Dependências e por que cada uma:**

| Pacote | Por que foi escolhido |
|---|---|
| `react` + `react-dom` | UI baseada em componentes — estado reativo, re-render eficiente |
| `axios` | HTTP client com interceptors — interceptor de refresh token automático (renova JWT expirado sem logout) |
| `recharts` | Gráficos declarativos em React — burndown, pizza de status, barras de custo |
| `react-syntax-highlighter` | Highlight de código na tela de Componentes — exibe `codeSnippet` com cores por linguagem |
| `@devflow/types` | Enums compartilhados — frontend usa os mesmos `TaskStatus`, `Role` etc. do backend |

| DevDependency | Por que foi escolhido |
|---|---|
| `vite` | Dev server e bundler ultra-rápido — HMR instantâneo, build com Rollup |
| `@vitejs/plugin-react` | Suporte a JSX + Fast Refresh no Vite |
| `tailwindcss` | CSS utilitário — classes direto no JSX, dark mode via classe `dark` na raiz |
| `postcss` + `autoprefixer` | Tailwind precisa do PostCSS para processar as classes em CSS final |

---

### `packages/types` — Contratos Compartilhados

**Nome do pacote:** `@devflow/types`
**Stack:** TypeScript puro — sem runtime, sem dependências

**Por que foi feito:**
Backend e frontend precisam concordar sobre a "forma" dos dados. Sem esse pacote, os tipos estariam duplicados: `TaskStatus` definido em dois lugares, com risco de um ficar desatualizado. Um enum diferente entre back e front causaria bugs silenciosos (valores que o frontend envia e o backend rejeita, ou vice-versa).

`@devflow/types` é a **fonte única de verdade** para contratos de dados. Qualquer mudança de schema que afete a API é feita aqui e ambos os apps recebem o erro de TypeScript imediatamente.

**Como rodar:**

```bash
cd packages/types

npm run build      # compila TypeScript → dist/ (necessário antes de usar nos apps)
npm run dev        # tsc --watch — recompila a cada mudança (útil ao editar tipos)
```

> Em dev, rode `npm run dev` aqui em paralelo com os outros apps para que mudanças nos tipos reflitam imediatamente.

**O que exporta:**

| Export | Tipo | O que representa |
|---|---|---|
| `Role` | enum | Cargos do sistema: GERENTE, LIDER, DESENVOLVEDOR, QA |
| `TaskStatus` | enum | Colunas do Kanban: BACKLOG → CONCLUIDO |
| `TaskPriority` | enum | Prioridade da tarefa: CRITICA, ALTA, MEDIA, BAIXA |
| `DocType` / `DocFormat` / `DocStatus` | enum | Classificação e estado de documentos |
| `Quadrant` | enum | Quadrantes Eisenhower: FAZER, AGENDAR, DELEGAR, ELIMINAR |
| `JwtPayload` | interface | Payload decodificado do JWT: `{ userId, role }` |
| `UserDTO` | interface | Dados de usuário retornados pela API |
| `TaskDTO` | interface | Tarefa completa com priorização opcional |
| `DocumentDTO` | interface | Documento técnico com versão e status |
| `RolePermissionDTO` | interface | Permissão RBAC: `roleName × module × action × allowed` |
| `NotificationDTO` | interface | Notificação persistida por usuário |
| `CostBreakdownDTO` | interface | Dados do dashboard de custo estimado |

**Como funciona no monorepo:**
Os apps referenciam este pacote com `"@devflow/types": "workspace:*"` no `package.json`. O pnpm resolve o `workspace:*` para o diretório local `packages/types/dist/` — nenhum publish no npm necessário.

---

## Onde `@devflow/types` está sendo usado hoje

### Arquivos migrados — Backend (`apps/api`)

| Arquivo | O que importa | O que substituiu |
|---|---|---|
| `src/middlewares/auth.middleware.ts` | `JwtPayload` | interface definida inline no próprio arquivo |
| `src/validators/auth.validator.ts` | `Role` | `z.enum(["GERENTE", "LIDER", ...])` |
| `src/validators/user.validator.ts` | `Role` | `z.enum(["GERENTE", "LIDER", ...])` |
| `src/validators/task.validator.ts` | `TaskStatus`, `TaskPriority`, `Quadrant` | `z.enum(["BACKLOG", ...])` em 4 lugares |
| `src/utils/ownership.ts` | `Role` | `role !== "GERENTE"` (string solta) |
| `src/repositories/task.repository.ts` | `TaskStatus` | `status: { notIn: ["CONCLUIDO"] }` |

### Arquivos migrados — Frontend (`apps/web`)

| Arquivo | O que importa | O que substituiu |
|---|---|---|
| `src/components/KanbanPage.jsx` | `TaskStatus` | strings `"BACKLOG"`, `"CONCLUIDO"` etc. em mapas e `useState` |
| `src/components/kanban/NewTaskModal.jsx` | `TaskStatus`, `TaskPriority`, `Quadrant` | arrays de opções com strings e `computeQuadrant` retornando strings |

---

### Como empacotar (adicionar ao pacote)

Edita `packages/types/src/index.ts` e adiciona o que precisar:

```typescript
// exemplo: novo status de tarefa
export enum TaskStatus {
  BACKLOG   = "BACKLOG",
  AFAZER    = "AFAZER",
  PROGRESSO = "PROGRESSO",
  REVISAO   = "REVISAO",
  CONCLUIDO = "CONCLUIDO",
  CANCELADO = "CANCELADO",  // ← novo valor aqui
}
```

Depois compila:
```bash
cd packages/types
npm run build
```

TypeScript sublinha vermelho em todo lugar que não trata o novo valor — você nunca esquece de atualizar.

---

### Como desempacotar (usar nos arquivos)

```typescript
// Backend (.ts)
import { Role, TaskStatus, TaskPriority, Quadrant } from "@devflow/types"

// Frontend (.jsx) — funciona igual
import { TaskStatus } from "@devflow/types"
```

**Backend** resolve via `apps/api/tsconfig.json` → `packages/types/dist/index` (compilado).  
**Frontend** resolve via `apps/web/vite.config.js` → `packages/types/src/index.ts` (Vite compila na hora).

#### Exemplos reais do projeto

```typescript
// validator — enum do pacote, não string duplicada
import { TaskStatus } from "@devflow/types"
z.nativeEnum(TaskStatus)   // aceita só valores do enum

// comparação de role
import { Role } from "@devflow/types"
if (req.user.role !== Role.GERENTE) throw new ForbiddenError(...)

// estado no React
import { TaskStatus } from "@devflow/types"
const [status, setStatus] = useState(TaskStatus.BACKLOG)
```

---

## Variáveis de Ambiente

Criar `apps/api/.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/devflow"
JWT_SECRET="seu_secret_aqui"
JWT_REFRESH_SECRET="seu_refresh_secret_aqui"
PORT=3000
```
