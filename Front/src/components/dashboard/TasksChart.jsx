// src/components/dashboard/TasksChart.jsx

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { tasksByDay } from "../../data/dashboardData";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-lg text-xs">
      <p className="font-semibold text-[#1B2A4A] mb-1.5">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 py-0.5">
          <div
            className="w-2.5 h-2.5 rounded-sm"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-slate-500">{entry.name}:</span>
          <span className="font-semibold text-slate-700">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function TasksChart() {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-5">
      <h3 className="text-sm font-semibold text-[#1B2A4A] mb-4">
        Tarefas por dia — Sprint Atual
      </h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={tasksByDay} barGap={2} barSize={14}>
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
            iconType="square"
            iconSize={10}
            wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
          />
          <Bar dataKey="concluidas" name="Concluídas" fill="#16A34A" radius={[3, 3, 0, 0]} />
          <Bar dataKey="pendentes" name="Pendentes" fill="#2563EB" radius={[3, 3, 0, 0]} />
          <Bar dataKey="atrasadas" name="Atrasadas" fill="#DC2626" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
