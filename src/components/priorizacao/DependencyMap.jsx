// src/components/priorizacao/DependencyMap.jsx

import { priorityTasks, priorityConfig, statusConfig } from "../../data/priorizacaoData";

export default function DependencyMap() {
  // Get only tasks that have dependencies or are depended upon
  const tasksWithDeps = priorityTasks.filter((t) => t.dependencies.length > 0);
  const dependedUpon = new Set();
  tasksWithDeps.forEach((t) => t.dependencies.forEach((d) => dependedUpon.add(d)));

  const findTask = (id) => priorityTasks.find((t) => t.id === id);

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-[#1B2A4A]">Mapa de Dependências</h3>
        <p className="text-[11px] text-slate-400 mt-0.5">
          Tarefas que dependem de outras para iniciar
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {tasksWithDeps.map((task) => {
          const p = priorityConfig[task.priority];
          const s = statusConfig[task.status];

          return (
            <div key={task.id} className="border border-slate-100 rounded-lg p-3">
              {/* Current task */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-semibold ${p.color}`}>
                    <span className={`w-1 h-1 rounded-full ${p.dot}`} />
                    {p.label}
                  </span>
                  <span className="text-[12px] font-medium text-[#1B2A4A]">{task.title}</span>
                </div>
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${s.color}`}>
                  {s.label}
                </span>
              </div>

              {/* Dependencies */}
              <div className="ml-4 flex flex-col gap-1.5">
                {task.dependencies.map((depId) => {
                  const dep = findTask(depId);
                  if (!dep) return null;
                  const depStatus = statusConfig[dep.status];
                  const isComplete = dep.status === "concluido";

                  return (
                    <div
                      key={depId}
                      className="flex items-center gap-2 text-[11px]"
                    >
                      {/* Arrow */}
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={isComplete ? "#16A34A" : "#F59E0B"} strokeWidth="2" strokeLinecap="round">
                        <path d="M9 18l6-6-6-6" />
                      </svg>

                      {/* Check or warning */}
                      {isComplete ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="8" x2="12" y2="12" />
                          <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                      )}

                      <span className={isComplete ? "text-slate-400 line-through" : "text-slate-600 font-medium"}>
                        {dep.title}
                      </span>

                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${depStatus.color}`}>
                        {depStatus.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-4 text-[11px] text-slate-400">
        <span className="flex items-center gap-1">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Dependência resolvida
        </span>
        <span className="flex items-center gap-1">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          Dependência pendente (bloqueante)
        </span>
      </div>
    </div>
  );
}
