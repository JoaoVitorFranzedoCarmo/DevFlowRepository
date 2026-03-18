// src/data/mockData.js

export const categories = [
  "Todos",
  "Autenticação",
  "CRUD",
  "UI Components",
  "Integração API",
  "Formulários",
  "Dashboard",
];

export const languages = ["Todas", "React", "Python", "Java", "C#", "Node.js"];

export const components = [
  {
    id: 1,
    name: "Sistema de Autenticação JWT",
    desc: "Login, registro e refresh token com JWT. Inclui middleware de proteção de rotas e gestão de sessão.",
    category: "Autenticação",
    lang: "Node.js",
    author: "João Vitor",
    date: "12/03/2026",
    uses: 8,
    rating: 4.8,
    tags: ["JWT", "Auth", "Middleware"],
  },
  {
    id: 2,
    name: "CRUD Genérico com Paginação",
    desc: "Componente reutilizável para operações CRUD com paginação server-side, filtros dinâmicos e ordenação.",
    category: "CRUD",
    lang: "React",
    author: "Leander",
    date: "08/03/2026",
    uses: 12,
    rating: 4.9,
    tags: ["CRUD", "Paginação", "REST"],
  },
  {
    id: 3,
    name: "Dashboard de Métricas",
    desc: "Painel com gráficos de linha, barra e pizza usando Recharts. Inclui filtros de período e exportação PDF.",
    category: "Dashboard",
    lang: "React",
    author: "João Vitor",
    date: "01/03/2026",
    uses: 5,
    rating: 4.5,
    tags: ["Charts", "Recharts", "PDF"],
  },
  {
    id: 4,
    name: "Integração GitHub API",
    desc: "Serviço completo para integração com GitHub REST API v3. Commits, PRs, issues e webhooks.",
    category: "Integração API",
    lang: "Node.js",
    author: "Leander",
    date: "25/02/2026",
    uses: 6,
    rating: 4.7,
    tags: ["GitHub", "REST", "Webhook"],
  },
  {
    id: 5,
    name: "Formulário Dinâmico",
    desc: "Gerador de formulários baseado em JSON Schema com validação automática, masks e campos condicionais.",
    category: "Formulários",
    lang: "React",
    author: "João Vitor",
    date: "20/02/2026",
    uses: 15,
    rating: 4.9,
    tags: ["Forms", "Validation", "JSON Schema"],
  },
  {
    id: 6,
    name: "Tabela Avançada com Filtros",
    desc: "Componente de tabela com busca, filtros por coluna, ordenação, seleção múltipla e ações em lote.",
    category: "UI Components",
    lang: "React",
    author: "Leander",
    date: "15/02/2026",
    uses: 10,
    rating: 4.6,
    tags: ["Table", "Filtros", "DataGrid"],
  },
];

export const lessons = [
  {
    id: 1,
    title: "JWT Refresh Token em Produção",
    project: "Sistema RH",
    author: "João Vitor",
    desc: "Implementar rotação de refresh tokens para evitar roubo de sessão. Usar blacklist em Redis.",
  },
  {
    id: 2,
    title: "Paginação com Cursor vs Offset",
    project: "E-commerce API",
    author: "Leander",
    desc: "Para datasets grandes (>100k registros), cursor-based pagination tem performance 10x melhor que offset.",
  },
  {
    id: 3,
    title: "Testes E2E com CI/CD",
    project: "DevFlow v0.5",
    author: "João Vitor",
    desc: "Rodar testes E2E em containers Docker isolados no pipeline evita flaky tests por estado compartilhado.",
  },
];

export const suggestions = [
  {
    comp: "Sistema de Autenticação JWT",
    match: "95%",
    reason: "Seu projeto possui módulo de login. Este componente já resolve autenticação completa.",
  },
  {
    comp: "Dashboard de Métricas",
    match: "88%",
    reason: "Detectamos que o projeto usa Recharts. Este dashboard é compatível e pronto para uso.",
  },
  {
    comp: "Integração GitHub API",
    match: "82%",
    reason: "O projeto requer integração com Git. Este serviço cobre a API do GitHub.",
  },
];
