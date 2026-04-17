// src/components/dashboard/BurndownChart.jsx

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { burndownData } from "../../data/dashboardData";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-lg text-xs">
      <p className="font-semibold text-[#1B2A4A] mb-1.5">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 py-0.5">
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-slate-500">{entry.name}:</span>
          <span className="font-semibold text-slate-700">
            {entry.value !== null ? `${entry.value} tarefas` : "—"}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function BurndownChart() {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-5">
      <h3 className="text-sm font-semibold text-[#1B2A4A] mb-4">
        Burndown — Sprint Atual
      </h3>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={burndownData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
          <XAxis
            dataKey="day"
            tick={{ fontSize: 11, fill: "#94A3B8" }}
            axisLine={{ stroke: "#E2E8F0" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#94A3B8" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
          />
          <Line
            type="monotone"
            dataKey="ideal"
            name="Ideal"
            stroke="#94A3B8"
            strokeDasharray="6 3"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="real"
            name="Real"
            stroke="#2563EB"
            strokeWidth={2.5}
            dot={{ r: 3, fill: "#2563EB" }}
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
