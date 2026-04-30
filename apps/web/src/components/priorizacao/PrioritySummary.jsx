// src/components/priorizacao/PrioritySummary.jsx

export default function PrioritySummary({ tasks = [], prioritized = [] }) {
  const total = tasks.length;
  const criticas = tasks.filter((t) => t.priorityRaw === "CRITICA").length;
  const withDeps = tasks.filter((t) => (t.dependencies?.length || 0) > 0).length;
  const blocked = tasks.filter((t) =>
    (t.dependencies || []).some((dep) => dep.status !== "CONCLUIDO")
  ).length;
  const avgScore = prioritized.length
    ? Math.round((prioritized.reduce((s, t) => s + (t.score || 0), 0) / prioritized.length) * 10) / 10
    : 0;

  const cards = [
    { label: "Total de Tarefas", value: total, color: "text-[#1B2A4A] dark:text-slate-100", accent: "bg-[#1B2A4A]" },
    { label: "Prioridade Crítica", value: criticas, color: "text-red-600", accent: "bg-red-600" },
    { label: "Com Dependências", value: withDeps, color: "text-amber-600", accent: "bg-amber-500" },
    { label: "Bloqueadas", value: blocked, color: "text-orange-600", accent: "bg-orange-500" },
    { label: "Score Médio", value: avgScore, color: "text-blue-600", accent: "bg-blue-600" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
      {cards.map((card, i) => (
        <div
          key={i}
          className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 relative overflow-hidden"
        >
          <div className={`absolute top-0 left-0 w-1 h-full ${card.accent}`} />
          <div className="text-[11px] text-slate-400 dark:text-slate-400 mb-1">{card.label}</div>
          <div className={`text-xl font-bold ${card.color}`}>{card.value}</div>
        </div>
      ))}
    </div>
  );
}
