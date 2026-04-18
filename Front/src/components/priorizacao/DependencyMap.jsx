// src/components/priorizacao/DependencyMap.jsx
import { priorityConfig, statusConfig } from "../../data/priorizacaoData";

const STATUS_KEY = {
  BACKLOG: "backlog", AFAZER: "afazer", PROGRESSO: "progresso", REVISAO: "revisao", CONCLUIDO: "concluido",
};

export default function DependencyMap({ tasks = [], onEdit }) {
  const tasksWithDeps = tasks.filter((t) => (t.dependencies?.length || 0) > 0);
  const findTask = (id) => tasks.find((t) => t.id === id);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-[#1B2A4A] dark:text-slate-100">Mapa de Dependências</h3>
        <p className="text-[11px] text-slate-400 mt-0.5">
          Tarefas que dependem de outras para iniciar
        </p>
      </div>

      {tasksWithDeps.length === 0 && (
        <div className="text-center text-slate-400 text-sm py-6">
          Nenhuma tarefa com dependências.
        </div>
      )}

      <div className="flex flex-col gap-3">
        {tasksWithDeps.map((task) => {
          const p = priorityConfig[task.priority] || priorityConfig.media;
          const statusKey = STATUS_KEY[task.statusRaw];
          const s = statusConfig[statusKey] || { label: task.statusRaw, color: "bg-slate-100 text-slate-600" };

          return (
            <div key={task.id} className="border border-slate-100 dark:border-slate-700 rounded-lg p-3">
              <button
                onClick={() => onEdit && onEdit(task)}
                className="w-full flex items-center justify-between mb-2 text-left hover:bg-slate-50 dark:hover:bg-slate-700/30 rounded-md px-1 py-1"
              >
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-semibold ${p.color}`}>
                    <span className={`w-1 h-1 rounded-full ${p.dot}`} />
                    {p.label}
                  </span>
                  <span className="text-[12px] font-medium text-[#1B2A4A] dark:text-slate-100">{task.title}</span>
                </div>
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${s.color}`}>
                  {s.label}
                </span>
              </button>

              <div className="ml-4 flex flex-col gap-1.5">
                {task.dependencies.map((depRef) => {
                  const full = findTask(depRef.id);
                  const label = full?.title || depRef.title || "Dependência";
                  const statusRaw = full?.statusRaw || depRef.status;
                  const depStatusKey = STATUS_KEY[statusRaw];
                  const depStatus = statusConfig[depStatusKey] || { label: statusRaw, color: "bg-slate-100 text-slate-600" };
                  const isComplete = statusRaw === "CONCLUIDO";

                  return (
                    <div
                      key={depRef.id}
                      className="flex items-center gap-2 text-[11px]"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={isComplete ? "#16A34A" : "#F59E0B"} strokeWidth="2" strokeLinecap="round">
                        <path d="M9 18l6-6-6-6" />
                      </svg>
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
                      <span className={isComplete ? "text-slate-400 line-through" : "text-slate-600 dark:text-slate-300 font-medium"}>
                        {label}
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

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center gap-4 text-[11px] text-slate-400 flex-wrap">
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
