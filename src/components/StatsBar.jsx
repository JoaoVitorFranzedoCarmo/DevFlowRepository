// src/components/StatsBar.jsx

import { components, categories, lessons } from "../data/mockData";

export default function StatsBar() {
  const stats = [
    { label: "Total de Componentes", value: components.length, color: "text-[#1B2A4A]" },
    { label: "Reutilizações", value: components.reduce((a, c) => a + c.uses, 0), color: "text-blue-600" },
    { label: "Categorias", value: categories.length - 1, color: "text-green-600" },
    { label: "Lições Aprendidas", value: lessons.length, color: "text-amber-500" },
  ];

  return (
    <div className="flex gap-4 mb-6">
      {stats.map((s, i) => (
        <div key={i} className="flex-1 bg-white rounded-lg px-5 py-4 border border-slate-200">
          <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
          <div className="text-xs text-slate-400 mt-0.5">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
