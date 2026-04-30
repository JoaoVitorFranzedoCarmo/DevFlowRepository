// src/components/dashboard/TasksChart.jsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload) return null;
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 shadow-lg text-xs">
      <p className="font-semibold text-[#1B2A4A] dark:text-slate-100 mb-1.5">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 py-0.5">
          <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: entry.color }} />
          <span className="text-slate-500 dark:text-slate-400">{entry.name}:</span>
          <span className="font-semibold text-slate-700 dark:text-slate-200">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function TasksChart({ stats }) {
  const byPriority = stats?.byPriority || {};
  const data = [
    { priority: "Crítica", total: byPriority.CRITICA || 0, fill: "#DC2626" },
    { priority: "Alta", total: byPriority.ALTA || 0, fill: "#F97316" },
    { priority: "Média", total: byPriority.MEDIA || 0, fill: "#F59E0B" },
    { priority: "Baixa", total: byPriority.BAIXA || 0, fill: "#16A34A" },
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5">
      <h3 className="text-sm font-semibold text-[#1B2A4A] dark:text-slate-100 mb-4">
        Tarefas por Prioridade
      </h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} barSize={32}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
          <XAxis dataKey="priority" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={{ stroke: "#E2E8F0" }} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip content={<CustomTooltip />} />
          <Legend iconType="square" iconSize={10} wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
          <Bar dataKey="total" name="Total" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
