// src/components/dashboard/SummaryCards.jsx

function formatBRL(v) {
  if (typeof v !== "number") return "R$ 0,00";
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function SummaryCards({ stats, cost, loading }) {
  const total = stats?.total ?? 0;
  const completed = stats?.completed ?? 0;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
  const overdue = 0;
  const totalCost = cost?.totalCost ?? 0;
  const hourlyRate = cost?.hourlyRate ?? 50;

  const cards = [
    {
      label: "Progresso Geral",
      value: `${progress}%`,
      sub: `${completed} de ${total} tarefas`,
      color: "text-[#1B2A4A] dark:text-slate-100",
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
      value: completed,
      sub: "no total",
      color: "text-green-600",
      accent: "bg-green-500",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ),
    },
    {
      label: "Em Progresso",
      value: stats?.inProgress ?? 0,
      sub: "em andamento",
      color: "text-amber-600",
      accent: "bg-amber-500",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      ),
    },
    {
      label: "Custo Estimado",
      value: formatBRL(totalCost),
      sub: `Valor/hora: ${formatBRL(hourlyRate)}`,
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

  void overdue;

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
      role="region"
      aria-label="Resumo"
    >
      {cards.map((card, i) => (
        <article
          key={i}
          className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5 relative overflow-hidden hover:shadow-sm transition-shadow"
          aria-label={`${card.label}: ${card.value}`}
        >
          <div className={`absolute top-0 left-0 w-1 h-full ${card.accent}`} aria-hidden="true" />
          <div className="flex items-start justify-between mb-2">
            <span className="text-xs text-slate-400 dark:text-slate-400">{card.label}</span>
            <span className={`${card.color} opacity-40`}>{card.icon}</span>
          </div>
          <div className={`text-2xl font-bold ${card.color}`}>{loading ? "…" : card.value}</div>
          <div className="text-xs text-slate-400 dark:text-slate-400 mt-1">{card.sub}</div>
        </article>
      ))}
    </div>
  );
}
