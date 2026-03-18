// src/components/dashboard/TaskDistributionChart.jsx

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { taskDistribution, projectSummary } from "../../data/dashboardData";

export default function TaskDistributionChart() {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-5">
      <h3 className="text-sm font-semibold text-[#1B2A4A] mb-4">
        Distribuição de Tarefas
      </h3>

      <div className="flex items-center gap-6">
        {/* Donut chart */}
        <div className="relative w-40 h-40 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={taskDistribution}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
                stroke="none"
              >
                {taskDistribution.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-[#1B2A4A]">
              {projectSummary.totalTasks}
            </span>
            <span className="text-[10px] text-slate-400">tarefas</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-3 flex-1">
          {taskDistribution.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-slate-600">{item.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-[#1B2A4A]">
                  {item.value}
                </span>
                <span className="text-xs text-slate-400">
                  ({Math.round((item.value / projectSummary.totalTasks) * 100)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
