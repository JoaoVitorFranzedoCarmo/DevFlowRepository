// src/components/KanbanPage.jsx
// Updated to use API instead of mock data

import { useState, useMemo, useCallback, useEffect } from "react";
import * as tasksApi from "../api/tasks";
import KanbanHeader from "./kanban/KanbanHeader";
import KanbanColumn from "./kanban/KanbanColumn";
import LoadingSpinner from "./LoadingSpinner";

const columnOrder = ["BACKLOG", "AFAZER", "PROGRESSO", "REVISAO", "CONCLUIDO"];

const columnMeta = {
  BACKLOG: { title: "Backlog", color: "#64748B" },
  AFAZER: { title: "A Fazer", color: "#2563EB" },
  PROGRESSO: { title: "Em Progresso", color: "#F59E0B" },
  REVISAO: { title: "Em Revisão", color: "#8B5CF6" },
  CONCLUIDO: { title: "Concluído", color: "#16A34A" },
};

export default function KanbanPage() {
  const [columns, setColumns] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [search, setSearch] = useState("");
  const [filterPriority, setFilterPriority] = useState("todas");
  const [filterAssignee, setFilterAssignee] = useState("todos");

  // Fetch kanban board from API
  const fetchBoard = useCallback(async () => {
    try {
      setLoading(true);
      const data = await tasksApi.getKanbanBoard();
      // Transform API response to match column format
      const cols = {};
      columnOrder.forEach((status) => {
        cols[status.toLowerCase()] = {
          id: status.toLowerCase(),
          title: columnMeta[status].title,
          color: columnMeta[status].color,
          tasks: (data[status] || []).map((t) => ({
            id: t.id,
            title: t.title,
            desc: t.desc,
            priority: t.priority.toLowerCase(),
            assignee: t.assignee?.name || "Não atribuído",
            tags: t.tags || [],
            dueDate: t.dueDate
              ? new Date(t.dueDate).toLocaleDateString("pt-BR")
              : "",
          })),
        };
      });
      setColumns(cols);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBoard();
  }, [fetchBoard]);

  // Drag start handler
  function handleDragStart(e, taskId) {
    setDraggedTaskId(taskId);
    e.dataTransfer.effectAllowed = "move";
  }

  // Find which column a task belongs to
  function findColumnByTask(taskId) {
    if (!columns) return null;
    return Object.keys(columns).find((colId) =>
      columns[colId].tasks.some((t) => t.id === taskId)
    );
  }

  // Drop handler - move task between columns via API
  async function handleDrop(e, targetColId) {
    e.preventDefault();
    if (!draggedTaskId || !columns) return;

    const sourceColId = findColumnByTask(draggedTaskId);
    if (!sourceColId || sourceColId === targetColId) {
      setDraggedTaskId(null);
      return;
    }

    // Optimistic update
    setColumns((prev) => {
      const newCols = JSON.parse(JSON.stringify(prev));
      const sourceCol = newCols[sourceColId];
      const targetCol = newCols[targetColId];

      const taskIndex = sourceCol.tasks.findIndex((t) => t.id === draggedTaskId);
      if (taskIndex === -1) return prev;
      const [task] = sourceCol.tasks.splice(taskIndex, 1);
      targetCol.tasks.push(task);

      return newCols;
    });

    // Call API
    const statusMap = {
      backlog: "BACKLOG",
      afazer: "AFAZER",
      progresso: "PROGRESSO",
      revisao: "REVISAO",
      concluido: "CONCLUIDO",
    };

    try {
      await tasksApi.moveTask(draggedTaskId, statusMap[targetColId]);
    } catch {
      // Revert on error
      fetchBoard();
    }

    setDraggedTaskId(null);
  }

  // Apply filters to columns
  const filteredColumns = useMemo(() => {
    if (!columns) return {};
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
  const totalTasks = columns
    ? Object.values(columns).reduce((sum, col) => sum + col.tasks.length, 0)
    : 0;

  const colOrder = ["backlog", "afazer", "progresso", "revisao", "concluido"];

  if (loading) return <LoadingSpinner message="Carregando quadro Kanban..." />;

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-2">{error}</div>
        <button
          onClick={fetchBoard}
          className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

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
        {colOrder.map((colId) => (
          columns[colId] && (
            <span key={colId} className="flex items-center gap-1">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: columns[colId].color }}
              />
              {columns[colId].title}: {columns[colId].tasks.length}
            </span>
          )
        ))}
      </div>

      {/* Kanban board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {colOrder.map((colId) => (
          filteredColumns[colId] && (
            <KanbanColumn
              key={colId}
              column={filteredColumns[colId]}
              onDragStart={handleDragStart}
              onDrop={handleDrop}
            />
          )
        ))}
      </div>
    </>
  );
}
