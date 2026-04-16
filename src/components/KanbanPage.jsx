// src/components/KanbanPage.jsx
import { useState, useMemo, useEffect, useCallback } from "react";
import api from "../services/api";
import KanbanHeader from "./kanban/KanbanHeader";
import KanbanColumn from "./kanban/KanbanColumn";
import NewTaskModal from "./kanban/NewTaskModal";
import { priorityConfig } from "../data/kanbanData";

const STATUS_TO_COL = {
  BACKLOG: "backlog",
  AFAZER: "afazer",
  PROGRESSO: "progresso",
  REVISAO: "revisao",
  CONCLUIDO: "concluido",
};

const COL_TO_STATUS = {
  backlog: "BACKLOG",
  afazer: "AFAZER",
  progresso: "PROGRESSO",
  revisao: "REVISAO",
  concluido: "CONCLUIDO",
};

const PRIORITY_DOWN = { CRITICA: "critica", ALTA: "alta", MEDIA: "media", BAIXA: "baixa" };

const columnMeta = {
  backlog:   { id: "backlog",   title: "Backlog",       color: "#64748B" },
  afazer:    { id: "afazer",    title: "A Fazer",        color: "#2563EB" },
  progresso: { id: "progresso", title: "Em Progresso",   color: "#F59E0B" },
  revisao:   { id: "revisao",   title: "Em Revisão",     color: "#8B5CF6" },
  concluido: { id: "concluido", title: "Concluído",      color: "#16A34A" },
};

function buildColumns(tasks) {
  const cols = {};
  Object.keys(columnMeta).forEach((k) => { cols[k] = { ...columnMeta[k], tasks: [] }; });
  tasks.forEach((t) => {
    const col = STATUS_TO_COL[t.status] || "backlog";
    cols[col].tasks.push({
      id: t.id,
      title: t.title,
      desc: t.desc || "",
      priority: PRIORITY_DOWN[t.priority] || "media",
      assignee: t.assignee?.name || "—",
      tags: t.tags || [],
      dueDate: t.dueDate ? new Date(t.dueDate).toLocaleDateString("pt-BR") : "—",
    });
  });
  return cols;
}

const columnOrder = ["backlog", "afazer", "progresso", "revisao", "concluido"];

export default function KanbanPage() {
  const [columns, setColumns] = useState(() => {
    const cols = {};
    Object.keys(columnMeta).forEach((k) => { cols[k] = { ...columnMeta[k], tasks: [] }; });
    return cols;
  });
  const [loading, setLoading] = useState(true);
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [search, setSearch] = useState("");
  const [filterPriority, setFilterPriority] = useState("todas");
  const [filterAssignee, setFilterAssignee] = useState("todos");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState("BACKLOG");
  const [saving, setSaving] = useState(false);

  const fetchTasks = useCallback(async () => {
    try {
      const { data } = await api.get("/tasks");
      setColumns(buildColumns(data));
    } catch (err) {
      console.error("Erro ao carregar tarefas:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const findColumnByTask = useCallback((taskId) => {
    return Object.keys(columns).find((colId) =>
      columns[colId].tasks.some((t) => t.id === taskId)
    );
  }, [columns]);

  const handleDragStart = useCallback((e, taskId) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.effectAllowed = "move";
  }, []);

  const handleDrop = useCallback(async (e, targetColId) => {
    e.preventDefault();
    if (!draggedTaskId) return;
    const sourceColId = findColumnByTask(draggedTaskId);
    if (!sourceColId || sourceColId === targetColId) { setDraggedTaskId(null); return; }

    const taskId = draggedTaskId;
    // Atualiza UI imediatamente (optimistic)
    setColumns((prev) => {
      const newCols = structuredClone(prev);
      const taskIdx = newCols[sourceColId].tasks.findIndex((t) => t.id === taskId);
      if (taskIdx === -1) return prev;
      const [task] = newCols[sourceColId].tasks.splice(taskIdx, 1);
      newCols[targetColId].tasks.push(task);
      return newCols;
    });
    setDraggedTaskId(null);

    // Persiste no backend
    try {
      await api.patch(`/tasks/${taskId}/move`, { status: COL_TO_STATUS[targetColId] });
    } catch {
      fetchTasks(); // Reverte em caso de erro
    }
  }, [draggedTaskId, findColumnByTask, fetchTasks]);

  const handleCreateTask = useCallback(async (data) => {
    setSaving(true);
    try {
      await api.post("/tasks", data);
      setModalOpen(false);
      await fetchTasks();
    } catch {
      // silently fail — user sees no feedback change
    } finally {
      setSaving(false);
    }
  }, [fetchTasks]);

  const handleDeleteTask = useCallback(async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      await fetchTasks();
    } catch {
      // silently fail
    }
  }, [fetchTasks]);

  const openNewTaskModal = useCallback((colId) => {
    setModalStatus(COL_TO_STATUS[colId] || "BACKLOG");
    setModalOpen(true);
  }, []);

  const filteredColumns = useMemo(() => {
    const result = {};
    Object.keys(columns).forEach((colId) => {
      const col = columns[colId];
      const filteredTasks = col.tasks.filter((task) => {
        const matchSearch =
          search === "" ||
          task.title.toLowerCase().includes(search.toLowerCase()) ||
          task.desc.toLowerCase().includes(search.toLowerCase());
        const matchPriority = filterPriority === "todas" || task.priority === filterPriority;
        const matchAssignee = filterAssignee === "todos" || task.assignee === filterAssignee;
        return matchSearch && matchPriority && matchAssignee;
      });
      result[colId] = { ...col, tasks: filteredTasks };
    });
    return result;
  }, [columns, search, filterPriority, filterAssignee]);

  const totalTasks = Object.values(columns).reduce((sum, col) => sum + col.tasks.length, 0);

  if (loading) {
    return <div className="flex items-center justify-center py-20 text-slate-400 text-sm">Carregando tarefas...</div>;
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
        onNewTask={() => { setModalStatus("BACKLOG"); setModalOpen(true); }}
      />

      <div className="flex items-center gap-4 mb-4 text-xs text-slate-400">
        <span>{totalTasks} tarefas no total</span>
        <span className="w-px h-3 bg-slate-200" />
        {columnOrder.map((colId) => (
          <span key={colId} className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: columns[colId].color }} />
            {columns[colId].title}: {columns[colId].tasks.length}
          </span>
        ))}
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {columnOrder.map((colId) => (
          <KanbanColumn
            key={colId}
            column={filteredColumns[colId]}
            onDragStart={handleDragStart}
            onDrop={handleDrop}
            onNewTask={() => openNewTaskModal(colId)}
            onDeleteTask={handleDeleteTask}
          />
        ))}
      </div>

      {modalOpen && (
        <NewTaskModal
          initialStatus={modalStatus}
          onConfirm={handleCreateTask}
          onClose={() => setModalOpen(false)}
          loading={saving}
        />
      )}
    </>
  );
}
