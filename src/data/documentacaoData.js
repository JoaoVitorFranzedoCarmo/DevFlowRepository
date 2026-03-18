// src/data/documentacaoData.js

export const generatedDocs = [
  {
    id: "d1",
    title: "API de Autenticação",
    type: "openapi",
    format: "HTML",
    version: "v2.3.1",
    codeVersion: "main@a3f7c2d",
    generatedAt: "17/03/2026 09:42",
    author: "João Vitor",
    language: "Node.js",
    status: "atualizado",
    pages: 24,
    endpoints: 12,
  },
  {
    id: "d2",
    title: "Módulo de Priorização",
    type: "tecnica",
    format: "PDF",
    version: "v1.8.0",
    codeVersion: "main@b12e4fa",
    generatedAt: "16/03/2026 14:20",
    author: "Leander",
    language: "React",
    status: "atualizado",
    pages: 18,
    endpoints: null,
  },
  {
    id: "d3",
    title: "Serviço de Notificações",
    type: "openapi",
    format: "HTML",
    version: "v1.2.0",
    codeVersion: "develop@8f3a1bc",
    generatedAt: "15/03/2026 11:05",
    author: "João Vitor",
    language: "Node.js",
    status: "desatualizado",
    pages: 10,
    endpoints: 6,
  },
  {
    id: "d4",
    title: "Componentes de UI",
    type: "tecnica",
    format: "HTML",
    version: "v3.1.2",
    codeVersion: "main@c44d9e1",
    generatedAt: "14/03/2026 16:30",
    author: "Leander",
    language: "React",
    status: "atualizado",
    pages: 32,
    endpoints: null,
  },
  {
    id: "d5",
    title: "Manual do Usuário - DevFlow",
    type: "manual",
    format: "PDF",
    version: "v1.0.0",
    codeVersion: "—",
    generatedAt: "12/03/2026 10:00",
    author: "João Vitor",
    language: "—",
    status: "rascunho",
    pages: 45,
    endpoints: null,
  },
  {
    id: "d6",
    title: "Integração GitHub API",
    type: "openapi",
    format: "HTML",
    version: "v2.0.0",
    codeVersion: "main@f92b7a3",
    generatedAt: "10/03/2026 08:15",
    author: "Leander",
    language: "Node.js",
    status: "atualizado",
    pages: 15,
    endpoints: 9,
  },
];

export const templates = [
  { id: "tp1", name: "Documentação Técnica", desc: "Gerada a partir de comentários do código (Javadoc, Docstring). Inclui classes, métodos, parâmetros e retornos.", icon: "code", uses: 18 },
  { id: "tp2", name: "API REST (OpenAPI)", desc: "Documentação interativa de API baseada em especificação OpenAPI/Swagger. Endpoints, schemas e exemplos.", icon: "api", uses: 14 },
  { id: "tp3", name: "Manual do Usuário", desc: "Guia de uso do sistema com capturas de tela, passo a passo e FAQ para usuários finais.", icon: "book", uses: 6 },
  { id: "tp4", name: "Documento de Arquitetura", desc: "Visão geral da arquitetura, diagramas de componentes, decisões técnicas e padrões adotados.", icon: "arch", uses: 4 },
  { id: "tp5", name: "Ata de Reunião", desc: "Registro de reuniões com participantes, pauta, decisões e ações definidas.", icon: "meeting", uses: 22 },
  { id: "tp6", name: "Release Notes", desc: "Notas de versão com features, correções, breaking changes e instruções de migração.", icon: "release", uses: 10 },
];

export const versionHistory = [
  { version: "v2.3.1", date: "17/03/2026", commit: "a3f7c2d", author: "João Vitor", changes: "Adicionados 2 novos endpoints de recuperação de senha", doc: "API de Autenticação" },
  { version: "v2.3.0", date: "14/03/2026", commit: "e5b8f12", author: "João Vitor", changes: "Implementado refresh token e logout", doc: "API de Autenticação" },
  { version: "v3.1.2", date: "14/03/2026", commit: "c44d9e1", author: "Leander", changes: "Novo componente DatePicker documentado", doc: "Componentes de UI" },
  { version: "v1.8.0", date: "16/03/2026", commit: "b12e4fa", author: "Leander", changes: "Documentação da Matriz de Eisenhower e Value vs Effort", doc: "Módulo de Priorização" },
  { version: "v2.0.0", date: "10/03/2026", commit: "f92b7a3", author: "Leander", changes: "Migração para GitHub API v4 (GraphQL)", doc: "Integração GitHub API" },
  { version: "v1.2.0", date: "15/03/2026", commit: "8f3a1bc", author: "João Vitor", changes: "Endpoints de push notification adicionados", doc: "Serviço de Notificações" },
];

export const scanConfig = {
  languages: [
    { name: "Java", ext: "Javadoc", enabled: true },
    { name: "Python", ext: "Docstring", enabled: true },
    { name: "JavaScript", ext: "JSDoc", enabled: true },
    { name: "C#", ext: "XML Comments", enabled: false },
  ],
  formats: ["HTML", "PDF", "Markdown"],
  integrations: [
    { name: "OpenAPI / Swagger", status: "conectado" },
    { name: "GitHub", status: "conectado" },
    { name: "GitLab", status: "desconectado" },
  ],
};

export const docTypeConfig = {
  openapi: { label: "API REST", color: "bg-purple-100 text-purple-700", dot: "bg-purple-500" },
  tecnica: { label: "Técnica", color: "bg-blue-100 text-blue-700", dot: "bg-blue-500" },
  manual: { label: "Manual", color: "bg-amber-100 text-amber-700", dot: "bg-amber-500" },
};

export const docStatusConfig = {
  atualizado: { label: "Atualizado", color: "bg-green-100 text-green-700" },
  desatualizado: { label: "Desatualizado", color: "bg-red-100 text-red-700" },
  rascunho: { label: "Rascunho", color: "bg-slate-100 text-slate-600" },
};
