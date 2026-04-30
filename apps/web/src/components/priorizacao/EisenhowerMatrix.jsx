// src/components/priorizacao/EisenhowerMatrix.jsx
import { eisenhowerQuadrants, priorityConfig } from "../../data/priorizacaoData";

const QUADRANT_META = {
  fazer:    { q: "Q1", row: "Importante",     col: "Urgente" },
  agendar:  { q: "Q2", row: "Importante",     col: "Não Urgente" },
  delegar:  { q: "Q3", row: "Não Importante", col: "Urgente" },
  eliminar: { q: "Q4", row: "Não Importante", col: "Não Urgente" },
};

function TaskCard({ task, onEdit }) {
  const p = priorityConfig[task.priority] || priorityConfig.media;
  const initials =
    task.assignee !== "—"
      ? task.assignee.split(" ").map((n) => n[0]).join("").slice(0, 2)
      : "?";
  const isInferred = !task.prioritization;

  return (
    <button
      onClick={() => onEdit && onEdit(task)}
      className="w-full text-left bg-white dark:bg-slate-700 rounded-md px-3 py-2 border border-slate-100 dark:border-slate-600 hover:shadow-sm hover:border-blue-300 dark:hover:border-blue-500 transition-all"
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <span className="text-[12px] font-medium text-[#1B2A4A] dark:text-slate-100 leading-snug">
          {task.title}
        </span>
        <span className={`shrink-0 px-1.5 py-0.5 rounded text-[9px] font-semibold ${p.color}`}>
          {p.label}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-full bg-[#1B2A4A] dark:bg-slate-500 text-white flex items-center justify-center text-[7px] font-semibold">
            {initials}
          </div>
          <span className="text-[10px] text-slate-400">{task.assignee}</span>
        </div>
        {isInferred && (
          <span className="text-[9px] text-slate-300 dark:text-slate-500 italic">inferido</span>
        )}
      </div>
    </button>
  );
}

function QuadrantCard({ quadrantKey, tasks, onEdit }) {
  const q = eisenhowerQuadrants[quadrantKey];
  const meta = QUADRANT_META[quadrantKey];

  return (
    <div className={`rounded-lg border-2 ${q.border} ${q.bg} dark:bg-slate-800/40 p-4 flex flex-col min-h-[200px]`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className={`text-[10px] font-bold ${q.text} opacity-50`}>{meta.q}</span>
            <span className={`text-sm font-bold ${q.text}`}>{q.title}</span>
          </div>
          <div className="text-[11px] text-slate-400">{q.subtitle}</div>
        </div>
        <span
          className={`text-xs font-bold ${q.text} bg-white/80 dark:bg-slate-700/80 w-6 h-6 rounded-full flex items-center justify-center shrink-0`}
        >
          {tasks.length}
        </span>
      </div>

      <div className="flex flex-col gap-2 flex-1">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onEdit={onEdit} />
        ))}
        {tasks.length === 0 && (
          <div className="flex-1 flex items-center justify-center text-xs text-slate-300 dark:text-slate-600 italic py-4">
            Nenhuma tarefa
          </div>
        )}
      </div>
    </div>
  );
}

export default function EisenhowerMatrix({ tasks = [], onEdit }) {
  const grouped = {
    fazer:    tasks.filter((t) => t.quadrantKey === "fazer"),
    agendar:  tasks.filter((t) => t.quadrantKey === "agendar"),
    delegar:  tasks.filter((t) => t.quadrantKey === "delegar"),
    eliminar: tasks.filter((t) => t.quadrantKey === "eliminar"),
  };

  const inferred = tasks.filter((t) => !t.prioritization).length;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5">
      {/* Header */}
      <div className="flex items-start justify-between mb-5 flex-wrap gap-3">
        <div>
          <h3 className="text-sm font-semibold text-[#1B2A4A] dark:text-slate-100">
            Matriz de Eisenhower
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Urgência × Importância · clique numa tarefa para editar
          </p>
          {inferred > 0 && (
            <p className="text-[11px] text-amber-500 mt-0.5">
              {inferred} tarefa{inferred > 1 ? "s" : ""} com quadrante inferido da prioridade do Kanban
            </p>
          )}
        </div>
        <div className="flex items-center gap-3 text-[11px] text-slate-400 flex-wrap">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> Q1 Fazer</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" /> Q2 Agendar</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> Q3 Delegar</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-400" /> Q4 Eliminar</span>
        </div>
      </div>

      {/* Matrix with axis labels */}
      <div className="flex gap-2">
        {/* Y-axis label */}
        <div className="flex flex-col w-7 shrink-0 pt-9">
          <div className="flex-1 flex items-center justify-center">
            <span
              className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest select-none"
              style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
            >
              ↑ Importante
            </span>
          </div>
          <div className="h-px bg-slate-200 dark:bg-slate-600 my-1 w-3 self-center" />
          <div className="flex-1 flex items-center justify-center">
            <span
              className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest select-none"
              style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
            >
              Não Importante ↓
            </span>
          </div>
        </div>

        {/* Grid area */}
        <div className="flex-1">
          {/* Column headers */}
          <div className="grid grid-cols-2 mb-2">
            <div className="flex items-center justify-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Urgente
              </span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Não Urgente
              </span>
            </div>
          </div>

          {/* Quadrant grid */}
          <div className="grid grid-cols-2 gap-3">
            <QuadrantCard quadrantKey="fazer"    tasks={grouped.fazer}    onEdit={onEdit} />
            <QuadrantCard quadrantKey="agendar"  tasks={grouped.agendar}  onEdit={onEdit} />
            <QuadrantCard quadrantKey="delegar"  tasks={grouped.delegar}  onEdit={onEdit} />
            <QuadrantCard quadrantKey="eliminar" tasks={grouped.eliminar} onEdit={onEdit} />
          </div>
        </div>
      </div>
    </div>
  );
}
