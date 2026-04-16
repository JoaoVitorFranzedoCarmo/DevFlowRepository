// src/components/kanban/KanbanColumn.jsx
import { useState, useCallback, memo } from "react";
import KanbanCard from "./KanbanCard";

const KanbanColumn = memo(function KanbanColumn({ column, onDragStart, onDrop, onNewTask, onDeleteTask }) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e) => { e.preventDefault(); setIsDragOver(true); }, []);
  const handleDragLeave = useCallback(() => { setIsDragOver(false); }, []);
  const handleDrop = useCallback((e) => { e.preventDefault(); setIsDragOver(false); onDrop(e, column.id); }, [onDrop, column.id]);

  return (
    <div className="flex flex-col w-72 shrink-0">
      {/* Column header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: column.color }} />
          <span className="text-[13px] font-semibold text-[#1B2A4A]">{column.title}</span>
          <span className="bg-slate-100 text-slate-500 text-[11px] font-medium px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
            {column.tasks.length}
          </span>
        </div>
        <button
          onClick={onNewTask}
          title="Nova tarefa"
          className="text-slate-400 hover:text-blue-600 transition-colors p-0.5"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex-1 flex flex-col gap-2.5 p-2 rounded-lg min-h-[200px] transition-colors ${
          isDragOver
            ? "bg-blue-50 border-2 border-dashed border-blue-300"
            : "bg-slate-50/50 border-2 border-transparent"
        }`}
      >
        {column.tasks.map((task) => (
          <KanbanCard key={task.id} task={task} onDragStart={onDragStart} onDelete={onDeleteTask} />
        ))}

        {column.tasks.length === 0 && !isDragOver && (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-300 text-xs py-8 gap-2">
            <span>Arraste tarefas para cá</span>
            <button
              onClick={onNewTask}
              className="text-blue-400 hover:text-blue-600 transition-colors text-[11px] flex items-center gap-1"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Nova tarefa
            </button>
          </div>
        )}

        {isDragOver && (
          <div className="border-2 border-dashed border-blue-300 rounded-lg py-6 flex items-center justify-center text-blue-400 text-xs">
            Soltar aqui
          </div>
        )}
      </div>
    </div>
  );
});

export default KanbanColumn;
