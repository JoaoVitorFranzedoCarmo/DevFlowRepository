# DevFlow — Backend API

Backend do sistema DevFlow, uma plataforma de gestão de equipes de desenvolvimento de software.

**Stack:** Node.js + Express + TypeScript + Prisma + PostgreSQL

---

## Como Rodar

### Com Docker (recomendado)

```bash
docker-compose up --build
```

A API estará disponível em `http://localhost:3001`.

Para rodar o seed (dados iniciais):

```bash
docker-compose exec api npx ts-node prisma/seed.ts
```

### Sem Docker

**Pré-requisitos:** Node.js 18+, PostgreSQL 14+

```bash
# 1. Instalar dependências
npm install

# 2. Copiar e configurar variáveis de ambiente
cp .env.example .env
# Edite o .env com suas credenciais do PostgreSQL

# 3. Rodar migrations
npx prisma migrate dev

# 4. Gerar Prisma Client
npx prisma generate

# 5. Rodar seed (dados iniciais)
npx ts-node prisma/seed.ts

# 6. Iniciar em modo desenvolvimento
npm run dev
```

A API estará disponível em `http://localhost:3001`.

---

## Variáveis de Ambiente

| Variável | Descrição | Default |
|---|---|---|
| `PORT` | Porta do servidor | `3001` |
| `NODE_ENV` | Ambiente | `development` |
| `DATABASE_URL` | URL de conexão PostgreSQL | — |
| `JWT_SECRET` | Secret para tokens de acesso | — |
| `JWT_EXPIRES_IN` | Expiração do access token | `1h` |
| `JWT_REFRESH_SECRET` | Secret para refresh tokens | — |
| `JWT_REFRESH_EXPIRES_IN` | Expiração do refresh token | `7d` |
| `CORS_ORIGIN` | Origem permitida pelo CORS | `http://localhost:5173` |

---

## Credenciais do Seed

| Nome | E-mail | Senha | Role |
|---|---|---|---|
| João Vitor Franze | joao.vitor@pucpr.edu.br | 123456 | GERENTE |
| Leander Reblin Hallu | leander.hallu@pucpr.edu.br | 123456 | DESENVOLVEDOR |

---

## Rotas da API

Base URL: `http://localhost:3001/api`

### Health Check

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/health` | Status da API |

### Autenticação (`/api/auth`)

| Método | Rota | Body | Resposta | Auth |
|---|---|---|---|---|
| POST | `/auth/register` | `{ name, email, password, role? }` | `{ user, accessToken, refreshToken }` | Não |
| POST | `/auth/login` | `{ email, password }` | `{ user, accessToken, refreshToken }` | Não |
| POST | `/auth/refresh` | `{ refreshToken }` | `{ accessToken, refreshToken }` | Não |
| POST | `/auth/logout` | `{ refreshToken }` | `204 No Content` | Não |
| GET | `/auth/me` | — | `{ id, name, email, role, avatar }` | Sim |

### Usuários (`/api/users`)

| Método | Rota | Body | Resposta | Auth |
|---|---|---|---|---|
| GET | `/users` | — | `User[]` | Sim |
| GET | `/users/:id` | — | `User` | Sim |
| PUT | `/users/:id` | `{ name?, email?, role?, avatar? }` | `User` | Sim |
| DELETE | `/users/:id` | — | `204` | Sim (GERENTE) |

### Componentes (`/api/components`)

| Método | Rota | Body / Query | Resposta | Auth |
|---|---|---|---|---|
| GET | `/components` | `?category=&lang=&search=` | `Component[]` | Sim |
| GET | `/components/stats` | — | `{ total, totalUses, categories }` | Sim |
| GET | `/components/:id` | — | `Component` | Sim |
| POST | `/components` | `{ name, desc, category, lang, tags? }` | `Component` | Sim |
| PUT | `/components/:id` | `{ name?, desc?, category?, lang?, tags?, uses?, rating? }` | `Component` | Sim |
| DELETE | `/components/:id` | — | `204` | Sim |

### Lições Aprendidas (`/api/lessons`)

| Método | Rota | Body / Query | Resposta | Auth |
|---|---|---|---|---|
| GET | `/lessons` | `?search=` | `Lesson[]` | Sim |
| GET | `/lessons/:id` | — | `Lesson` | Sim |
| POST | `/lessons` | `{ title, project, desc }` | `Lesson` | Sim |
| PUT | `/lessons/:id` | `{ title?, project?, desc? }` | `Lesson` | Sim |
| DELETE | `/lessons/:id` | — | `204` | Sim |

### Tarefas (`/api/tasks`)

| Método | Rota | Body / Query | Resposta | Auth |
|---|---|---|---|---|
| GET | `/tasks` | `?status=&priority=&assigneeId=&search=` | `Task[]` | Sim |
| GET | `/tasks/kanban` | — | `{ BACKLOG: Task[], AFAZER: [], ... }` | Sim |
| GET | `/tasks/prioritized` | — | `Task[] (com score)` | Sim |
| GET | `/tasks/dashboard/stats` | — | `{ total, completed, pending, ... }` | Sim |
| GET | `/tasks/:id` | — | `Task` | Sim |
| POST | `/tasks` | `{ title, desc?, status?, priority?, tags?, dueDate?, assigneeId? }` | `Task` | Sim |
| PUT | `/tasks/:id` | `{ title?, desc?, status?, priority?, tags?, dueDate?, assigneeId? }` | `Task` | Sim |
| PATCH | `/tasks/:id/move` | `{ status }` | `Task` | Sim |
| DELETE | `/tasks/:id` | — | `204` | Sim |
| PUT | `/tasks/:id/prioritization` | `{ urgency, importance, value, effort, quadrant }` | `TaskPrioritization` | Sim |
| POST | `/tasks/:id/dependencies` | `{ targetTaskId }` | `TaskDependency` | Sim |
| DELETE | `/tasks/:id/dependencies/:targetId` | — | `204` | Sim |

**Status válidos:** `BACKLOG`, `AFAZER`, `PROGRESSO`, `REVISAO`, `CONCLUIDO`
**Prioridades válidas:** `CRITICA`, `ALTA`, `MEDIA`, `BAIXA`
**Quadrantes válidos:** `FAZER`, `AGENDAR`, `DELEGAR`, `ELIMINAR`

### Documentação (`/api/documents`)

| Método | Rota | Body / Query | Resposta | Auth |
|---|---|---|---|---|
| GET | `/documents` | `?type=&status=&search=` | `Document[]` | Sim |
| GET | `/documents/stats` | — | `{ total, updated, outdated, ... }` | Sim |
| GET | `/documents/versions` | — | `DocumentVersion[]` | Sim |
| GET | `/documents/:id` | — | `Document` | Sim |
| POST | `/documents` | `{ title, type?, format?, version?, codeVersion?, status?, pages? }` | `Document` | Sim |
| PUT | `/documents/:id` | `(mesmos campos)` | `Document` | Sim |
| DELETE | `/documents/:id` | — | `204` | Sim |
| POST | `/documents/:id/versions` | `{ version, commit, changes, author }` | `DocumentVersion` | Sim |

### Templates (`/api/templates`)

| Método | Rota | Body | Resposta | Auth |
|---|---|---|---|---|
| GET | `/templates` | — | `Template[]` | Sim |
| GET | `/templates/:id` | — | `Template` | Sim |
| POST | `/templates` | `{ name, desc, icon? }` | `Template` | Sim |
| PUT | `/templates/:id` | `{ name?, desc?, icon?, uses? }` | `Template` | Sim |
| DELETE | `/templates/:id` | — | `204` | Sim |
| POST | `/templates/:id/use` | — | `Template (uses+1)` | Sim |

### Integrações (`/api/integrations`)

| Método | Rota | Body | Resposta | Auth |
|---|---|---|---|---|
| GET | `/integrations` | — | `Integration[]` (do usuário logado) | Sim |
| POST | `/integrations` | `{ name, desc, status?, icon? }` | `Integration` | Sim |
| PUT | `/integrations/:id` | `{ status?, desc? }` | `Integration` | Sim |
| PATCH | `/integrations/:id/toggle` | — | `Integration` (inverte status) | Sim |
| DELETE | `/integrations/:id` | — | `204` | Sim |

### Notificações (`/api/notifications`)

| Método | Rota | Body | Resposta | Auth |
|---|---|---|---|---|
| GET | `/notifications` | — | `NotificationSetting[]` (do usuário logado) | Sim |
| PUT | `/notifications` | `{ eventKey, email, push }` | `NotificationSetting` | Sim |
| PUT | `/notifications/bulk` | `{ settings: [{ eventKey, email, push }] }` | `NotificationSetting[]` | Sim |

---

## Estrutura do Projeto

```
devflow-backend/
├── src/
│   ├── config/          # Configurações (env, database)
│   ├── controllers/     # Controladores HTTP
│   ├── middlewares/      # Auth, roles, validação, erros
│   ├── routes/          # Definição das rotas
│   ├── services/        # Lógica de negócio
│   ├── utils/           # Utilitários (errors, asyncHandler)
│   ├── validators/      # Schemas de validação (Zod)
│   └── server.ts        # Entry point
├── prisma/
│   ├── schema.prisma    # Schema do banco de dados
│   └── seed.ts          # Dados iniciais
├── Dockerfile
├── docker-compose.yml
└── README.md
```

## Scripts

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia em modo desenvolvimento (hot reload) |
| `npm run build` | Compila TypeScript |
| `npm start` | Inicia a versão compilada |
| `npm run prisma:migrate` | Roda migrations |
| `npm run prisma:seed` | Popula o banco com dados iniciais |
| `npm run prisma:studio` | Abre o Prisma Studio (UI do banco) |
