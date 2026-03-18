// src/components/dashboard/SummaryCards.jsx

import { projectSummary } from "../../data/dashboardData";

const cards = [
  {
    label: "Progresso Geral",
    value: `${projectSummary.progress}%`,
    sub: `${projectSummary.completedTasks} de ${projectSummary.totalTasks} tarefas`,
    color: "text-[#1B2A4A]",
    accent: "bg-[#1B2A4A]",
  },
  {
    label: "Tarefas Concluídas",
    value: projectSummary.completedTasks,
    sub: "nesta sprint",
    color: "text-green-600",
    accent: "bg-green-600",
  },
  {
    label: "Tarefas Atrasadas",
    value: projectSummary.overdueTasks,
    sub: "requerem atenção",
    color: "text-red-600",
    accent: "bg-red-600",
  },
  {
    label: "Orçamento Utilizado",
    value: `R$ ${(projectSummary.budget.spent / 1000).toFixed(1)}k`,
    sub: `de R$ ${(projectSummary.budget.planned / 1000).toFixed(0)}k planejados`,
    color: "text-blue-600",
    accent: "bg-blue-600",
  },
];

export default function SummaryCards() {
  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      {cards.map((card, i) => (
        <div
          key={i}
          className="bg-white rounded-lg border border-slate-200 p-5 relative overflow-hidden"
        >
          <div className={`absolute top-0 left-0 w-1 h-full ${card.accent}`} />
          <div className="text-xs text-slate-400 mb-1">{card.label}</div>
          <div className={`text-2xl font-bold ${card.color}`}>{card.value}</div>
          <div className="text-xs text-slate-400 mt-1">{card.sub}</div>
        </div>
      ))}
    </div>
  );
}
