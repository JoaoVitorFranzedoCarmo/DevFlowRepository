# DevFlow — Camada de Integração Frontend ↔ Backend

Este pacote contém os arquivos necessários para conectar o frontend React ao backend Express.

---

## Arquivos incluídos

### Novos (adicionar ao projeto frontend)

```
src/
├── api/                    ← NOVA PASTA - Chamadas à API
│   ├── client.js           ← Fetch client com auth (intercepta 401, refresh token)
│   ├── auth.js             ← Login, register, logout, getMe
│   ├── tasks.js            ← CRUD tarefas + kanban + priorização
│   ├── components.js       ← CRUD componentes + stats
│   ├── lessons.js          ← CRUD lições aprendidas
│   ├── documents.js        ← CRUD documentos + versões + stats
│   ├── templates.js        ← CRUD templates
│   ├── users.js            ← CRUD usuários
│   ├── integrations.js     ← CRUD integrações + toggle
│   ├── notifications.js    ← CRUD notificações
│   └── index.js            ← Barrel export
├── contexts/               ← NOVA PASTA
│   └── AuthContext.jsx     ← Contexto de autenticação (user, login, logout)
├── hooks/                  ← NOVA PASTA
│   └── useApi.js           ← Hook genérico para data fetching
└── components/
    ├── LoginPage.jsx       ← NOVO - Tela de login/registro
    └── LoadingSpinner.jsx  ← NOVO - Spinner de carregamento
```

### Atualizados (substituir no projeto frontend)

```
src/
├── App.jsx                 ← Adicionado AuthProvider + guard de autenticação
├── components/
│   ├── Sidebar.jsx         ← Recebe user + onLogout via props
│   └── KanbanPage.jsx      ← Exemplo de página conectada à API
```

---

## Como integrar

### 1. Copie os arquivos novos

Copie as pastas `api/`, `contexts/`, `hooks/` e os novos componentes para dentro de `src/` do seu projeto frontend.

### 2. Substitua os arquivos atualizados

Substitua `App.jsx`, `Sidebar.jsx` e `KanbanPage.jsx` pelas versões deste pacote.

### 3. Rode o backend primeiro

```bash
cd devflow-backend
docker-compose up --build
# Em outro terminal:
docker-compose exec api npx ts-node prisma/seed.ts
```

### 4. Rode o frontend

```bash
cd devflow  # pasta do frontend
npm run dev
```

Acesse `http://localhost:5173` — você verá a tela de login.

---

## Padrão para conectar outras páginas

O `KanbanPage.jsx` serve como exemplo. Para conectar qualquer outra página:

### Antes (dados mock):
```jsx
import { components } from "../data/mockData";
// usa `components` diretamente
```

### Depois (API):
```jsx
import { useState, useEffect } from "react";
import * as componentsApi from "../api/components";
import LoadingSpinner from "./LoadingSpinner";

export default function MinhaPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    componentsApi.getComponents()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    // ... usa `data` no lugar de `components`
  );
}
```

### Ou usando o hook useApi:
```jsx
import { useApi } from "../hooks/useApi";
import * as componentsApi from "../api/components";

export default function MinhaPage() {
  const { data, loading, error, refetch } = useApi(componentsApi.getComponents);

  if (loading) return <LoadingSpinner />;
  if (error) return <div>Erro: {error}</div>;

  return (
    // ... usa `data`
  );
}
```

---

## Mapeamento de dados Mock → API

| Arquivo mock | API equivalente | Endpoint |
|---|---|---|
| `mockData.js` → components | `componentsApi.getComponents()` | GET /api/components |
| `mockData.js` → lessons | `lessonsApi.getLessons()` | GET /api/lessons |
| `mockData.js` → suggestions | (calculado no front por enquanto) | — |
| `kanbanData.js` → initialColumns | `tasksApi.getKanbanBoard()` | GET /api/tasks/kanban |
| `dashboardData.js` | `tasksApi.getDashboardStats()` | GET /api/tasks/dashboard/stats |
| `priorizacaoData.js` | `tasksApi.getPrioritizedTasks()` | GET /api/tasks/prioritized |
| `documentacaoData.js` → docs | `documentsApi.getDocuments()` | GET /api/documents |
| `documentacaoData.js` → templates | `templatesApi.getTemplates()` | GET /api/templates |
| `documentacaoData.js` → versions | `documentsApi.getVersionHistory()` | GET /api/documents/versions |
| `configData.js` → integrations | `integrationsApi.getIntegrations()` | GET /api/integrations |
| `configData.js` → notifications | `notificationsApi.getNotificationSettings()` | GET /api/notifications |

---

## Notas

- As páginas que ainda não foram conectadas continuam usando dados mock (sem quebrar)
- O `AuthContext` persiste o login no `localStorage` — funciona entre reloads
- O client faz refresh automático do token quando recebe 401
- Se o refresh falhar, dispara evento `devflow:logout` e redireciona para login
