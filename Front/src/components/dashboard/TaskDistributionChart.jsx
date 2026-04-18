// src/components/dashboard/TaskDistributionChart.jsx
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const STATUS_LABEL = {
  BACKLOG: "Backlog",
  AFAZER: "A Fazer",
  PROGRESSO: "Em Progresso",
  REVISAO: "Em Revisão",
  CONCLUIDO: "Concluído",
};

const STATUS_COLOR = {
  BACKLOG: "#64748B",
  AFAZER: "#2563EB",
  PROGRESSO: "#F59E0B",
  REVISAO: "#8B5CF6",
  CONCLUIDO: "#16A34A",
};

export default function TaskDistributionChart({ stats }) {
  const total = stats?.total ?? 0;
  const byStatus = stats?.byStatus || {};
  const data = Object.keys(STATUS_LABEL).map((k) => ({
    name: STATUS_LABEL[k],
    value: byStatus[k] || 0,
    color: STATUS_COLOR[k],
  })).filter((d) => d.value > 0);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5">
      <h3 className="text-sm font-semibold text-[#1B2A4A] dark:text-slate-100 mb-4">
        Distribuição de Tarefas
      </h3>

      <div className="flex items-center gap-6 flex-wrap">
        <div className="relative w-40 h-40 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
                stroke="none"
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-[#1B2A4A] dark:text-slate-100">{total}</span>
            <span className="text-[10px] text-slate-400">tarefas</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 flex-1 min-w-[160px]">
          {data.length === 0 && (
            <span className="text-slate-400 text-sm">Sem dados.</span>
          )}
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-slate-600 dark:text-slate-300">{item.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-[#1B2A4A] dark:text-slate-100">{item.value}</span>
                <span className="text-xs text-slate-400">
                  ({total > 0 ? Math.round((item.value / total) * 100) : 0}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
