// src/components/dashboard/CostBreakdown.jsx
function formatBRL(v) {
  return (v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function CostBreakdown({ cost }) {
  if (!cost) return null;
  const { totalCost = 0, totalHours = 0, hourlyRate = 50, byAssignee = [], bySprint = [] } = cost;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-[#1B2A4A] dark:text-slate-100">Custo por Membro</h3>
          <span className="text-[11px] text-slate-400">Total: {formatBRL(totalCost)}</span>
        </div>
        {byAssignee.length === 0 && (
          <p className="text-slate-400 text-sm text-center py-4">Sem dados.</p>
        )}
        <div className="flex flex-col gap-2">
          {byAssignee.map((a) => {
            const pct = totalCost > 0 ? (a.cost / totalCost) * 100 : 0;
            return (
              <div key={a.id}>
                <div className="flex items-center justify-between text-[12px] mb-1">
                  <span className="font-medium text-[#1B2A4A] dark:text-slate-100">{a.name}</span>
                  <span className="text-slate-500 dark:text-slate-400">
                    {formatBRL(a.cost)} · {a.hours.toFixed(1)}h
                  </span>
                </div>
                <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-[#1B2A4A] dark:text-slate-100">Custo por Sprint</h3>
          <span className="text-[11px] text-slate-400">
            {totalHours.toFixed(1)}h · {formatBRL(hourlyRate)}/h
          </span>
        </div>
        {bySprint.length === 0 && (
          <p className="text-slate-400 text-sm text-center py-4">Sem dados.</p>
        )}
        <div className="flex flex-col gap-2">
          {bySprint.map((s) => (
            <div key={s.name} className="flex items-center justify-between px-3 py-2 rounded-md bg-slate-50 dark:bg-slate-900/30">
              <span className="text-[13px] font-medium text-[#1B2A4A] dark:text-slate-100">{s.name}</span>
              <div className="text-right">
                <div className="text-[13px] font-semibold text-blue-600">{formatBRL(s.cost)}</div>
                <div className="text-[10px] text-slate-400">{s.hours.toFixed(1)}h</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
