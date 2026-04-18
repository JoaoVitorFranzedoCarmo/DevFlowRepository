// src/components/dashboard/SprintHeader.jsx
export default function SprintHeader({ stats }) {
  const total = stats?.total || 0;
  const done = stats?.completed || 0;
  const progressPercent = total > 0 ? Math.round((done / total) * 100) : 0;
  const today = new Date().toLocaleDateString("pt-BR");

  return (
    <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
      <div>
        <h1 className="text-xl font-bold text-[#1B2A4A] dark:text-slate-100">Dashboard</h1>
        <p className="text-sm text-slate-400 dark:text-slate-500 mt-0.5">Visão geral · {today}</p>
      </div>

      <div
        className="flex items-center gap-4"
        role="region"
        aria-label={`Progresso: ${progressPercent}%, ${done} de ${total} tarefas concluídas`}
      >
        <div className="text-right">
          <div className="text-xs text-slate-400 dark:text-slate-500">Tarefas concluídas</div>
          <div className="text-sm font-semibold text-[#1B2A4A] dark:text-slate-100">
            {done} / {total}
          </div>
        </div>

        <div
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          className="w-32 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden"
        >
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <span className="text-sm font-semibold text-blue-600">{progressPercent}%</span>
      </div>
    </div>
  );
}
