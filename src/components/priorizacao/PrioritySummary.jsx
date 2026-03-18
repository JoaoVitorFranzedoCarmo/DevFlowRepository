// src/components/priorizacao/PrioritySummary.jsx

import { priorityTasks } from "../../data/priorizacaoData";

export default function PrioritySummary() {
  const total = priorityTasks.length;
  const criticas = priorityTasks.filter((t) => t.priority === "critica").length;
  const withDeps = priorityTasks.filter((t) => t.dependencies.length > 0).length;
  const blocked = priorityTasks.filter((t) =>
    t.dependencies.some((depId) => {
      const dep = priorityTasks.find((d) => d.id === depId);
      return dep && dep.status !== "concluido";
    })
  ).length;

  const avgScore = Math.round(
    priorityTasks.reduce((sum, t) => {
      const score = (t.value * t.importance * t.urgency) / Math.max(t.effort, 1);
      return sum + score;
    }, 0) / total * 10
  ) / 10;

  const cards = [
    { label: "Total de Tarefas", value: total, color: "text-[#1B2A4A]", accent: "bg-[#1B2A4A]" },
    { label: "Prioridade Crítica", value: criticas, color: "text-red-600", accent: "bg-red-600" },
    { label: "Com Dependências", value: withDeps, color: "text-amber-600", accent: "bg-amber-500" },
    { label: "Bloqueadas", value: blocked, color: "text-orange-600", accent: "bg-orange-500" },
    { label: "Score Médio", value: avgScore, color: "text-blue-600", accent: "bg-blue-600" },
  ];

  return (
    <div className="grid grid-cols-5 gap-4 mb-6">
      {cards.map((card, i) => (
        <div
          key={i}
          className="bg-white rounded-lg border border-slate-200 p-4 relative overflow-hidden"
        >
          <div className={`absolute top-0 left-0 w-1 h-full ${card.accent}`} />
          <div className="text-[11px] text-slate-400 mb-1">{card.label}</div>
          <div className={`text-xl font-bold ${card.color}`}>{card.value}</div>
        </div>
      ))}
    </div>
  );
}
