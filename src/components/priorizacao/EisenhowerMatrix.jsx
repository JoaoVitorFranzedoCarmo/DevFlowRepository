// src/components/priorizacao/EisenhowerMatrix.jsx

import { priorityTasks, eisenhowerQuadrants, priorityConfig } from "../../data/priorizacaoData";

function QuadrantCard({ quadrantKey, tasks }) {
  const q = eisenhowerQuadrants[quadrantKey];

  return (
    <div className={`rounded-lg border ${q.border} ${q.bg} p-4 flex flex-col`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className={`text-sm font-semibold ${q.text}`}>{q.title}</div>
          <div className="text-[11px] text-slate-400">{q.subtitle}</div>
        </div>
        <span className={`text-xs font-bold ${q.text} bg-white/70 px-2 py-0.5 rounded-full`}>
          {tasks.length}
        </span>
      </div>

      {/* Tasks */}
      <div className="flex flex-col gap-2 flex-1">
        {tasks.map((task) => {
          const p = priorityConfig[task.priority];
          const initials = task.assignee.split(" ").map((n) => n[0]).join("");

          return (
            <div
              key={task.id}
              className="bg-white rounded-md px-3 py-2.5 border border-slate-100 hover:shadow-sm transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <span className="text-[12px] font-medium text-[#1B2A4A] leading-snug">
                  {task.title}
                </span>
                <span className={`shrink-0 inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-semibold ${p.color}`}>
                  <span className={`w-1 h-1 rounded-full ${p.dot}`} />
                  {p.label}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded-full bg-[#1B2A4A] text-white flex items-center justify-center text-[7px] font-semibold">
                    {initials}
                  </div>
                  <span className="text-[10px] text-slate-400">{task.assignee}</span>
                </div>
                {task.dependencies.length > 0 && (
                  <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                      <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
                    </svg>
                    {task.dependencies.length} dep.
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {tasks.length === 0 && (
          <div className="flex-1 flex items-center justify-center text-xs text-slate-300 py-4">
            Nenhuma tarefa
          </div>
        )}
      </div>
    </div>
  );
}

export default function EisenhowerMatrix() {
  const grouped = {
    fazer: priorityTasks.filter((t) => t.quadrant === "fazer"),
    agendar: priorityTasks.filter((t) => t.quadrant === "agendar"),
    delegar: priorityTasks.filter((t) => t.quadrant === "delegar"),
    eliminar: priorityTasks.filter((t) => t.quadrant === "eliminar"),
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-[#1B2A4A]">Matriz de Eisenhower</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Urgência × Importância</p>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500" /> Fazer
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-500" /> Agendar
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500" /> Delegar
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-slate-400" /> Eliminar
          </span>
        </div>
      </div>

      {/* Axis labels */}
      <div className="relative">
        {/* Y axis label */}
        <div className="absolute -left-1 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] text-slate-400 font-medium tracking-wider">
          IMPORTÂNCIA →
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-3 ml-4">
          <QuadrantCard quadrantKey="fazer" tasks={grouped.fazer} />
          <QuadrantCard quadrantKey="agendar" tasks={grouped.agendar} />
          <QuadrantCard quadrantKey="delegar" tasks={grouped.delegar} />
          <QuadrantCard quadrantKey="eliminar" tasks={grouped.eliminar} />
        </div>

        {/* X axis label */}
        <div className="text-center mt-2 text-[10px] text-slate-400 font-medium tracking-wider ml-4">
          URGÊNCIA →
        </div>
      </div>
    </div>
  );
}
