// src/components/kanban/KanbanCard.jsx

import { priorityConfig } from "../../data/kanbanData";

export default function KanbanCard({ task, onDragStart }) {
  const priority = priorityConfig[task.priority];
  const initials = task.assignee
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      className="bg-white rounded-lg border border-slate-200 p-3.5 cursor-grab active:cursor-grabbing hover:border-blue-300 hover:shadow-sm transition-all group"
    >
      {/* Priority + Tags */}
      <div className="flex items-center gap-1.5 mb-2 flex-wrap">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${priority.color}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />
          {priority.label}
        </span>
        {task.tags.map((tag) => (
          <span
            key={tag}
            className="bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded text-[10px]"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Title */}
      <div className="text-[13px] font-semibold text-[#1B2A4A] mb-1 leading-snug">
        {task.title}
      </div>

      {/* Description */}
      <div className="text-[11px] text-slate-400 leading-relaxed mb-3 line-clamp-2">
        {task.desc}
      </div>

      {/* Footer: assignee + due date */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full bg-[#1B2A4A] text-white flex items-center justify-center text-[8px] font-semibold">
            {initials}
          </div>
          <span className="text-[11px] text-slate-400">{task.assignee}</span>
        </div>
        <span className="text-[11px] text-slate-400 flex items-center gap-1">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          {task.dueDate}
        </span>
      </div>
    </div>
  );
}
