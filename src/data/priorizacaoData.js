// src/data/priorizacaoData.js

export const priorityTasks = [
  { id: "p1", title: "Sistema de autenticação RBAC", urgency: 5, importance: 5, value: 9, effort: 7, priority: "critica", assignee: "João Vitor", status: "progresso", dependencies: ["p5"], quadrant: "fazer" },
  { id: "p2", title: "Dashboard de métricas da sprint", urgency: 4, importance: 5, value: 8, effort: 6, priority: "alta", assignee: "Leander", status: "progresso", dependencies: [], quadrant: "fazer" },
  { id: "p3", title: "Geração automática de documentação", urgency: 4, importance: 4, value: 7, effort: 5, priority: "alta", assignee: "João Vitor", status: "revisao", dependencies: [], quadrant: "fazer" },
  { id: "p4", title: "Filtro avançado no Kanban", urgency: 3, importance: 4, value: 6, effort: 3, priority: "alta", assignee: "João Vitor", status: "afazer", dependencies: [], quadrant: "agendar" },
  { id: "p5", title: "Tela de login e registro", urgency: 5, importance: 5, value: 9, effort: 4, priority: "critica", assignee: "Leander", status: "concluido", dependencies: [], quadrant: "fazer" },
  { id: "p6", title: "Notificações por e-mail", urgency: 2, importance: 3, value: 5, effort: 4, priority: "media", assignee: "Leander", status: "afazer", dependencies: ["p1"], quadrant: "agendar" },
  { id: "p7", title: "Integração com Bitbucket", urgency: 1, importance: 2, value: 4, effort: 6, priority: "baixa", assignee: "Leander", status: "backlog", dependencies: [], quadrant: "eliminar" },
  { id: "p8", title: "Exportação de relatórios CSV", urgency: 2, importance: 4, value: 5, effort: 2, priority: "media", assignee: "João Vitor", status: "afazer", dependencies: ["p2"], quadrant: "agendar" },
  { id: "p9", title: "Tela de configurações do usuário", urgency: 2, importance: 3, value: 4, effort: 3, priority: "media", assignee: "Leander", status: "afazer", dependencies: ["p1"], quadrant: "delegar" },
  { id: "p10", title: "Tema escuro", urgency: 1, importance: 2, value: 3, effort: 3, priority: "baixa", assignee: "Leander", status: "backlog", dependencies: [], quadrant: "eliminar" },
  { id: "p11", title: "Componente de tabela reutilizável", urgency: 3, importance: 5, value: 8, effort: 4, priority: "alta", assignee: "João Vitor", status: "concluido", dependencies: [], quadrant: "fazer" },
  { id: "p12", title: "Integração com Slack", urgency: 2, importance: 3, value: 5, effort: 5, priority: "media", assignee: "João Vitor", status: "backlog", dependencies: ["p1"], quadrant: "delegar" },
];

export const eisenhowerQuadrants = {
  fazer: { title: "Fazer Agora", subtitle: "Urgente + Importante", color: "#DC2626", bg: "bg-red-50", border: "border-red-200", text: "text-red-700" },
  agendar: { title: "Agendar", subtitle: "Não Urgente + Importante", color: "#2563EB", bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700" },
  delegar: { title: "Delegar", subtitle: "Urgente + Não Importante", color: "#F59E0B", bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700" },
  eliminar: { title: "Eliminar", subtitle: "Não Urgente + Não Importante", color: "#64748B", bg: "bg-slate-50", border: "border-slate-200", text: "text-slate-600" },
};

export const priorityConfig = {
  critica: { label: "Crítica", color: "bg-red-100 text-red-700", dot: "bg-red-500" },
  alta: { label: "Alta", color: "bg-orange-100 text-orange-700", dot: "bg-orange-500" },
  media: { label: "Média", color: "bg-amber-100 text-amber-700", dot: "bg-amber-500" },
  baixa: { label: "Baixa", color: "bg-green-100 text-green-700", dot: "bg-green-500" },
};

export const statusConfig = {
  backlog: { label: "Backlog", color: "bg-slate-100 text-slate-600" },
  afazer: { label: "A Fazer", color: "bg-blue-100 text-blue-600" },
  progresso: { label: "Em Progresso", color: "bg-amber-100 text-amber-600" },
  revisao: { label: "Em Revisão", color: "bg-purple-100 text-purple-600" },
  concluido: { label: "Concluído", color: "bg-green-100 text-green-600" },
};
