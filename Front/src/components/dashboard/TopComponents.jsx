// src/components/dashboard/TopComponents.jsx

import { topReusedComponents } from "../../data/dashboardData";

export default function TopComponents() {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-5">
      <h3 className="text-sm font-semibold text-[#1B2A4A] mb-4">
        Componentes Mais Reutilizados
      </h3>

      <div className="flex flex-col">
        {/* Header */}
        <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 px-3 py-2 text-xs text-slate-400 font-medium border-b border-slate-100">
          <span className="w-6">#</span>
          <span>Componente</span>
          <span className="w-16 text-center">Linguagem</span>
          <span className="w-12 text-center">Usos</span>
          <span className="w-24 text-right">Tendência</span>
        </div>

        {/* Rows */}
        {topReusedComponents.map((comp, i) => (
          <div
            key={comp.name}
            className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 px-3 py-3 items-center text-sm border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <span className="w-6 text-xs font-bold text-slate-300">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="font-medium text-[#1B2A4A] truncate">{comp.name}</span>
            <span className="w-16 text-center">
              <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-[11px]">
                {comp.lang}
              </span>
            </span>
            <span className="w-12 text-center font-semibold text-blue-600">
              {comp.uses}x
            </span>
            <span className="w-24 text-right text-xs text-green-600">
              {comp.trend}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
