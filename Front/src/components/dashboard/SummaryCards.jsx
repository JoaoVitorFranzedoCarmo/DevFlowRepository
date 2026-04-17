// src/components/dashboard/SummaryCards.jsx

import { projectSummary } from "../../data/dashboardData";

const cards = [
  {
    label: "Progresso Geral",
    value: `${projectSummary.progress}%`,
    sub: `${projectSummary.completedTasks} de ${projectSummary.totalTasks} tarefas`,
    color: "text-[#1B2A4A]",
    accent: "bg-[#1B2A4A]",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
  },
  {
    label: "Tarefas Concluídas",
    value: projectSummary.completedTasks,
    sub: "nesta sprint",
    color: "text-green-600",
    accent: "bg-green-500",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
  },
  {
    label: "Tarefas Atrasadas",
    value: projectSummary.overdueTasks,
    sub: "requerem atenção",
    color: "text-red-600",
    accent: "bg-red-500",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
  },
  {
    label: "Orçamento Utilizado",
    value: `R$ ${(projectSummary.budget.spent / 1000).toFixed(1)}k`,
    sub: `de R$ ${(projectSummary.budget.planned / 1000).toFixed(0)}k planejados`,
    color: "text-blue-600",
    accent: "bg-blue-500",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
      </svg>
    ),
  },
];

export default function SummaryCards() {
  return (
    <div
      className="grid grid-cols-4 gap-4 mb-6"
      role="region"
      aria-label="Resumo da sprint"
    >
      {cards.map((card, i) => (
        <article
          key={i}
          className="bg-white rounded-lg border border-slate-200 p-5 relative overflow-hidden hover:shadow-sm transition-shadow"
          aria-label={`${card.label}: ${card.value} — ${card.sub}`}
        >
          <div className={`absolute top-0 left-0 w-1 h-full ${card.accent}`} aria-hidden="true" />
          <div className="flex items-start justify-between mb-2">
            <span className="text-xs text-slate-400">{card.label}</span>
            <span className={`${card.color} opacity-40`}>{card.icon}</span>
          </div>
          <div className={`text-2xl font-bold ${card.color}`} aria-label={`${card.value}`}>{card.value}</div>
          <div className="text-xs text-slate-400 mt-1">{card.sub}</div>
        </article>
      ))}
    </div>
  );
}
