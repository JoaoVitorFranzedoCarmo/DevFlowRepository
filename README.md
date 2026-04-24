# DevFlow

Sistema de gestão de equipes de desenvolvimento — Kanban, priorização, documentação, biblioteca de componentes e RBAC dinâmico.

---

## Início Rápido

```bash
# Terminal 1 — sobe backend + banco
cd Back\prisma
docker compose up --build

# Terminal 2 — seed (após backend iniciar)
docker compose exec api npm run prisma:seed

# Terminal 3 — frontend
cd Front
npm install
npm run dev
```

Acesse: **http://localhost:5173**

Credenciais padrão:
```
Email: joao.vitor@pucpr.edu.br
Senha: 123456
```

---

## Stack

| Camada | Tecnologias |
|--------|-------------|
| Frontend | React 18, Vite, Tailwind CSS, Recharts |
| Backend | Node.js, Express, TypeScript, Prisma ORM |
| Banco | PostgreSQL (Docker) |
| Auth | JWT access + refresh tokens |
| Validação | Zod |

---

## Funcionalidades

- **Kanban** — status BACKLOG → AFAZER → PROGRESSO → REVISAO → CONCLUIDO
- **Priorização** — matriz Eisenhower, ranking WSJF, mapa de dependências
- **Dashboard** — custo estimado real, burndown, distribuição de tarefas
- **Documentação** — geração HTML/PDF/Markdown via sourceCode, versionamento com restore
- **Componentes** — biblioteca com syntax highlight, rating e stats de uso
- **RBAC dinâmico** — permissões por módulo × ação, cargos customizados pelo Gerente
- **Notificações** — polling 30s, badge de não lidas, eventos de tarefa via Observer Pattern
- **Tema claro/escuro** — persiste em localStorage

---

## Estrutura

```
devflow/
├── Front/                  # React + Vite
│   └── src/
│       ├── components/     # páginas e subcomponentes por domínio
│       ├── context/        # AuthContext, ThemeContext
│       ├── services/       # api.js (axios + refresh interceptor)
│       ├── utils/          # taskMapper.js
│       └── data/           # dados estáticos por domínio
│
└── Back/prisma/            # Express + TypeScript
    ├── src/
    │   ├── controllers/    # camada HTTP
    │   ├── services/       # lógica de negócio
    │   ├── repositories/   # toda chamada Prisma
    │   ├── strategies/     # priorização + geração de docs
    │   ├── events/         # Observer Pattern (appEmitter)
    │   ├── middlewares/    # auth, RBAC, validate, error
    │   ├── routes/         # 12 domínios sob /api
    │   └── validators/     # schemas Zod
    └── prisma/
        ├── schema.prisma
        └── seed.ts
```

---

## URLs

| Serviço | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:3001 |
| Prisma Studio | http://localhost:5555 |

---

## Variáveis de Ambiente

`Back/prisma/.env`:
```env
PORT=3001
NODE_ENV=development
DATABASE_URL=postgresql://devflow:devflow123@localhost:5432/devflow_db?schema=public
JWT_SECRET=devflow-jwt-secret-change-in-production
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=devflow-refresh-secret-change-in-production
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

---

## Troubleshooting

**Porta em uso:**
```bash
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

**Banco corrompido:**
```bash
cd Back\prisma
docker compose down -v
docker compose up --build
docker compose exec api npm run prisma:seed
```

---

## Desenvolvedores

João Franze · João Marcelo · Fernando · Leander
