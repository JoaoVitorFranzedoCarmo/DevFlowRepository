// src/data/dashboardData.js

export const sprintInfo = {
  name: "Sprint 12",
  startDate: "03/03/2026",
  endDate: "17/03/2026",
  daysLeft: 3,
  totalDays: 14,
};

export const projectSummary = {
  progress: 68,
  totalTasks: 48,
  completedTasks: 33,
  pendingTasks: 10,
  overdueTasks: 5,
  budget: {
    planned: 115000,
    spent: 78200,
    percentage: 68,
  },
  deadline: "20/12/2026",
  daysToDeadline: 278,
};

export const tasksByDay = [
  { day: "Seg 03", concluidas: 3, pendentes: 5, atrasadas: 1 },
  { day: "Ter 04", concluidas: 5, pendentes: 4, atrasadas: 1 },
  { day: "Qua 05", concluidas: 4, pendentes: 3, atrasadas: 2 },
  { day: "Qui 06", concluidas: 6, pendentes: 3, atrasadas: 1 },
  { day: "Sex 07", concluidas: 3, pendentes: 4, atrasadas: 0 },
  { day: "Seg 10", concluidas: 5, pendentes: 2, atrasadas: 1 },
  { day: "Ter 11", concluidas: 4, pendentes: 3, atrasadas: 0 },
  { day: "Qua 12", concluidas: 2, pendentes: 5, atrasadas: 2 },
  { day: "Qui 13", concluidas: 6, pendentes: 2, atrasadas: 0 },
  { day: "Sex 14", concluidas: 3, pendentes: 4, atrasadas: 1 },
];

export const taskDistribution = [
  { name: "Concluídas", value: 33, color: "#16A34A" },
  { name: "Pendentes", value: 10, color: "#2563EB" },
  { name: "Atrasadas", value: 5, color: "#DC2626" },
];

export const burndownData = [
  { day: "D1", ideal: 48, real: 48 },
  { day: "D2", ideal: 44, real: 45 },
  { day: "D3", ideal: 41, real: 43 },
  { day: "D4", ideal: 37, real: 39 },
  { day: "D5", ideal: 34, real: 36 },
  { day: "D6", ideal: 30, real: 32 },
  { day: "D7", ideal: 27, real: 28 },
  { day: "D8", ideal: 23, real: 25 },
  { day: "D9", ideal: 20, real: 21 },
  { day: "D10", ideal: 16, real: 18 },
  { day: "D11", ideal: 13, real: 15 },
  { day: "D12", ideal: 10, real: null },
  { day: "D13", ideal: 6, real: null },
  { day: "D14", ideal: 0, real: null },
];

export const topReusedComponents = [
  { name: "Formulário Dinâmico", uses: 15, lang: "React", trend: "+3 esta sprint" },
  { name: "CRUD Genérico com Paginação", uses: 12, lang: "React", trend: "+2 esta sprint" },
  { name: "Tabela Avançada com Filtros", uses: 10, lang: "React", trend: "+1 esta sprint" },
  { name: "Sistema de Autenticação JWT", uses: 8, lang: "Node.js", trend: "—" },
  { name: "Integração GitHub API", uses: 6, lang: "Node.js", trend: "+1 esta sprint" },
];
