// src/components/dashboard/BurndownChart.jsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload) return null;
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 shadow-lg text-xs">
      <p className="font-semibold text-[#1B2A4A] dark:text-slate-100 mb-1.5">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 py-0.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-slate-500 dark:text-slate-400">{entry.name}:</span>
          <span className="font-semibold text-slate-700 dark:text-slate-200">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function BurndownChart({ stats }) {
  const total = stats?.total ?? 0;
  const done = stats?.completed ?? 0;
  const pending = total - done;
  const data = [
    { label: "Início", ideal: total, real: total },
    { label: "Meio", ideal: Math.round(total / 2), real: pending + Math.round(done / 2) },
    { label: "Hoje", ideal: 0, real: pending },
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5">
      <h3 className="text-sm font-semibold text-[#1B2A4A] dark:text-slate-100 mb-4">
        Burndown (estimado)
      </h3>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={{ stroke: "#E2E8F0" }} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip content={<CustomTooltip />} />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
          <Line type="monotone" dataKey="ideal" name="Ideal" stroke="#94A3B8" strokeDasharray="6 3" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="real" name="Pendentes" stroke="#2563EB" strokeWidth={2.5} dot={{ r: 3, fill: "#2563EB" }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
