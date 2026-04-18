// src/components/kanban/KanbanCard.jsx
import { priorityConfig } from "../../data/kanbanData";

export default function KanbanCard({ task, onDragStart, onDelete, onEdit }) {
  const priority = priorityConfig[task.priority] || priorityConfig.media;
  const initials = task.assignee && task.assignee !== "—"
    ? task.assignee.split(" ").map((n) => n[0]).join("").slice(0, 2)
    : "?";

  const depCount = task.dependencies?.length || 0;
  const hasDue = task.dueDate && task.dueDate !== "—";
  const hours = task.estimatedHours;

  return (
    <article
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      onClick={() => onEdit && onEdit(task)}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && onEdit) { e.preventDefault(); onEdit(task); }
      }}
      tabIndex={0}
      role="button"
      aria-label={`Tarefa: ${task.title}, prioridade ${priority.label}, responsável ${task.assignee}. Clique para editar.`}
      className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-3.5 cursor-grab active:cursor-grabbing hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 group relative focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
    >
      {onDelete && (
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
          aria-label={`Excluir tarefa: ${task.title}`}
          className="absolute top-2 right-2 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/30 text-slate-300 dark:text-slate-500 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
            <path d="M10 11v6" /><path d="M14 11v6" />
            <path d="M9 6V4h6v2" />
          </svg>
        </button>
      )}

      <div className="flex items-center gap-1.5 mb-2 flex-wrap">
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${priority.color}`}
          aria-label={`Prioridade ${priority.label}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} aria-hidden="true" />
          {priority.label}
        </span>
        {task.tags?.slice(0, 3).map((tag) => (
          <span key={tag} className="bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded text-[10px]">{tag}</span>
        ))}
        {task.tags?.length > 3 && (
          <span className="text-slate-400 text-[10px]">+{task.tags.length - 3}</span>
        )}
      </div>

      <h3 className="text-[13px] font-semibold text-[#1B2A4A] dark:text-slate-100 mb-1 leading-snug pr-4">{task.title}</h3>

      {task.desc && (
        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mb-3 line-clamp-2">{task.desc}</p>
      )}

      {/* Metadata strip */}
      <div className="flex items-center gap-3 text-[10px] text-slate-400 dark:text-slate-500 mb-2 flex-wrap">
        {typeof hours === "number" && (
          <span className="inline-flex items-center gap-1" title={`Estimado: ${hours}h`}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
            {hours}h
          </span>
        )}
        {depCount > 0 && (
          <span className="inline-flex items-center gap-1" title={`${depCount} dependência(s)`}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.72" />
              <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
            </svg>
            {depCount}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-1.5">
          <div
            className="w-6 h-6 rounded-full bg-[#1B2A4A] dark:bg-blue-600 text-white flex items-center justify-center text-[9px] font-semibold"
            aria-hidden="true"
          >
            {initials}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[100px]">{task.assignee}</span>
        </div>
        {hasDue && (
          <time
            dateTime={task.dueDate}
            className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1"
            aria-label={`Prazo: ${task.dueDate}`}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            {task.dueDate}
          </time>
        )}
      </div>
    </article>
  );
}
