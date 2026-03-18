// src/components/KanbanPage.jsx

import { useState, useMemo } from "react";
import { initialColumns } from "../data/kanbanData";
import KanbanHeader from "./kanban/KanbanHeader";
import KanbanColumn from "./kanban/KanbanColumn";

export default function KanbanPage() {
  const [columns, setColumns] = useState(initialColumns);
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [search, setSearch] = useState("");
  const [filterPriority, setFilterPriority] = useState("todas");
  const [filterAssignee, setFilterAssignee] = useState("todos");

  // Find which column a task belongs to
  function findColumnByTask(taskId) {
    return Object.keys(columns).find((colId) =>
      columns[colId].tasks.some((t) => t.id === taskId)
    );
  }

  // Drag start handler
  function handleDragStart(e, taskId) {
    setDraggedTaskId(taskId);
    e.dataTransfer.effectAllowed = "move";
  }

  // Drop handler - move task between columns
  function handleDrop(e, targetColId) {
    e.preventDefault();
    if (!draggedTaskId) return;

    const sourceColId = findColumnByTask(draggedTaskId);
    if (!sourceColId || sourceColId === targetColId) {
      setDraggedTaskId(null);
      return;
    }

    setColumns((prev) => {
      const newCols = JSON.parse(JSON.stringify(prev));
      const sourceCol = newCols[sourceColId];
      const targetCol = newCols[targetColId];

      // Find and remove task from source
      const taskIndex = sourceCol.tasks.findIndex((t) => t.id === draggedTaskId);
      if (taskIndex === -1) return prev;
      const [task] = sourceCol.tasks.splice(taskIndex, 1);

      // Add to target
      targetCol.tasks.push(task);

      return newCols;
    });

    setDraggedTaskId(null);
  }

  // Apply filters to columns
  const filteredColumns = useMemo(() => {
    const result = {};

    Object.keys(columns).forEach((colId) => {
      const col = columns[colId];
      const filteredTasks = col.tasks.filter((task) => {
        const matchSearch =
          search === "" ||
          task.title.toLowerCase().includes(search.toLowerCase()) ||
          task.desc.toLowerCase().includes(search.toLowerCase());
        const matchPriority =
          filterPriority === "todas" || task.priority === filterPriority;
        const matchAssignee =
          filterAssignee === "todos" || task.assignee === filterAssignee;
        return matchSearch && matchPriority && matchAssignee;
      });

      result[colId] = { ...col, tasks: filteredTasks };
    });

    return result;
  }, [columns, search, filterPriority, filterAssignee]);

  // Count totals
  const totalTasks = Object.values(columns).reduce(
    (sum, col) => sum + col.tasks.length,
    0
  );

  const columnOrder = ["backlog", "afazer", "progresso", "revisao", "concluido"];

  return (
    <>
      <KanbanHeader
        search={search}
        setSearch={setSearch}
        filterPriority={filterPriority}
        setFilterPriority={setFilterPriority}
        filterAssignee={filterAssignee}
        setFilterAssignee={setFilterAssignee}
      />

      {/* Task count summary */}
      <div className="flex items-center gap-4 mb-4 text-xs text-slate-400">
        <span>{totalTasks} tarefas no total</span>
        <span className="w-px h-3 bg-slate-200" />
        {columnOrder.map((colId) => (
          <span key={colId} className="flex items-center gap-1">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: columns[colId].color }}
            />
            {columns[colId].title}: {columns[colId].tasks.length}
          </span>
        ))}
      </div>

      {/* Kanban board - horizontal scroll */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columnOrder.map((colId) => (
          <KanbanColumn
            key={colId}
            column={filteredColumns[colId]}
            onDragStart={handleDragStart}
            onDrop={handleDrop}
          />
        ))}
      </div>
    </>
  );
}
