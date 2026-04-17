// src/components/priorizacao/ValueEffortChart.jsx

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
} from "recharts";
import { priorityTasks, priorityConfig } from "../../data/priorizacaoData";

const quadrantLabels = [
  { x: 2, y: 8.5, label: "Quick Wins", color: "#16A34A" },
  { x: 8, y: 8.5, label: "Projetos Grandes", color: "#2563EB" },
  { x: 2, y: 1.5, label: "Preencher Tempo", color: "#F59E0B" },
  { x: 8, y: 1.5, label: "Evitar", color: "#DC2626" },
];

const colorMap = {
  critica: "#DC2626",
  alta: "#F97316",
  media: "#F59E0B",
  baixa: "#16A34A",
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;
  const task = payload[0].payload;
  const p = priorityConfig[task.priority];

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-lg text-xs max-w-[220px]">
      <p className="font-semibold text-[#1B2A4A] mb-1">{task.title}</p>
      <div className="flex items-center gap-2 mb-1">
        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold ${p.color}`}>
          {p.label}
        </span>
        <span className="text-slate-400">{task.assignee}</span>
      </div>
      <div className="flex gap-3 mt-1.5 text-slate-500">
        <span>Valor: <strong className="text-[#1B2A4A]">{task.value}</strong></span>
        <span>Esforço: <strong className="text-[#1B2A4A]">{task.effort}</strong></span>
      </div>
    </div>
  );
};

const CustomDot = (props) => {
  const { cx, cy, payload } = props;
  const fill = colorMap[payload.priority] || "#94A3B8";

  return (
    <circle
      cx={cx}
      cy={cy}
      r={7}
      fill={fill}
      stroke="#fff"
      strokeWidth={2}
      style={{ cursor: "pointer" }}
    />
  );
};

export default function ValueEffortChart() {
  const data = priorityTasks.map((t) => ({
    ...t,
    x: t.effort,
    y: t.value,
  }));

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-[#1B2A4A]">Value vs. Effort</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Priorize tarefas de alto valor e baixo esforço
          </p>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          {Object.entries(colorMap).map(([key, color]) => (
            <span key={key} className="flex items-center gap-1 text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
              {priorityConfig[key].label}
            </span>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />

          {/* Quadrant backgrounds */}
          <ReferenceArea x1={0} x2={5} y1={5} y2={10} fill="#DCFCE7" fillOpacity={0.3} />
          <ReferenceArea x1={5} x2={10} y1={5} y2={10} fill="#DBEAFE" fillOpacity={0.3} />
          <ReferenceArea x1={0} x2={5} y1={0} y2={5} fill="#FEF3C7" fillOpacity={0.3} />
          <ReferenceArea x1={5} x2={10} y1={0} y2={5} fill="#FEE2E2" fillOpacity={0.3} />

          {/* Center lines */}
          <ReferenceLine x={5} stroke="#CBD5E1" strokeDasharray="4 4" />
          <ReferenceLine y={5} stroke="#CBD5E1" strokeDasharray="4 4" />

          <XAxis
            dataKey="x"
            type="number"
            domain={[0, 10]}
            tick={{ fontSize: 11, fill: "#94A3B8" }}
            axisLine={{ stroke: "#E2E8F0" }}
            tickLine={false}
            label={{ value: "Esforço →", position: "insideBottom", offset: -10, fontSize: 11, fill: "#94A3B8" }}
          />
          <YAxis
            dataKey="y"
            type="number"
            domain={[0, 10]}
            tick={{ fontSize: 11, fill: "#94A3B8" }}
            axisLine={false}
            tickLine={false}
            label={{ value: "Valor →", angle: -90, position: "insideLeft", offset: 5, fontSize: 11, fill: "#94A3B8" }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Scatter data={data} shape={<CustomDot />} />
        </ScatterChart>
      </ResponsiveContainer>

      {/* Quadrant legend */}
      <div className="flex justify-center gap-6 mt-2 text-[11px]">
        {quadrantLabels.map((q) => (
          <span key={q.label} className="flex items-center gap-1" style={{ color: q.color }}>
            <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: q.color, opacity: 0.3 }} />
            <span className="font-medium">{q.label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
