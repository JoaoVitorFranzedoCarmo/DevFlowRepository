// src/components/KanbanPage.jsx
import { useState, useMemo, useEffect, useCallback } from "react";
import api from "../services/api";
import KanbanHeader from "./kanban/KanbanHeader";
import KanbanColumn from "./kanban/KanbanColumn";
import NewTaskModal from "./kanban/NewTaskModal";
import { mapTask } from "../utils/taskMapper";

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
    cols[col].tasks.push(mapTask(t));
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
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [search, setSearch] = useState("");
  const [filterPriority, setFilterPriority] = useState("todas");
  const [filterAssignee, setFilterAssignee] = useState("todos");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState("BACKLOG");
  const [editingTask, setEditingTask] = useState(null);
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

  const fetchUsers = useCallback(async () => {
    try {
      const { data } = await api.get("/users");
      setUsers(Array.isArray(data) ? data : []);
    } catch {
      setUsers([]);
    }
  }, []);

  useEffect(() => { fetchTasks(); fetchUsers(); }, [fetchTasks, fetchUsers]);

  const allTasksFlat = useMemo(() => {
    return Object.values(columns).flatMap((c) => c.tasks);
  }, [columns]);

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
    setColumns((prev) => {
      const newCols = structuredClone(prev);
      const taskIdx = newCols[sourceColId].tasks.findIndex((t) => t.id === taskId);
      if (taskIdx === -1) return prev;
      const [task] = newCols[sourceColId].tasks.splice(taskIdx, 1);
      task.statusRaw = COL_TO_STATUS[targetColId];
      newCols[targetColId].tasks.push(task);
      return newCols;
    });
    setDraggedTaskId(null);

    try {
      await api.patch(`/tasks/${taskId}/move`, { status: COL_TO_STATUS[targetColId] });
    } catch {
      fetchTasks();
    }
  }, [draggedTaskId, findColumnByTask, fetchTasks]);

  const handleSaveTask = useCallback(async (data) => {
    setSaving(true);
    try {
      const payload = {
        title: data.title,
        desc: data.desc,
        status: data.status,
        priority: data.priority,
        tags: data.tags,
        dueDate: data.dueDate,
        assigneeId: data.assigneeId || null,
        estimatedHours: data.estimatedHours,
      };
      let taskId;
      if (editingTask) {
        const { data: updated } = await api.put(`/tasks/${editingTask.id}`, payload);
        taskId = updated.id;
      } else {
        const { data: created } = await api.post("/tasks", payload);
        taskId = created.id;
      }
      if (Array.isArray(data.dependencies)) {
        try {
          await api.put(`/tasks/${taskId}/dependencies`, { targetTaskIds: data.dependencies });
        } catch (e) {
          console.error("Erro ao salvar dependências:", e);
        }
      }
      if (data.prioritization) {
        try {
          await api.put(`/tasks/${taskId}/prioritization`, data.prioritization);
        } catch (e) {
          console.error("Erro ao salvar priorização:", e);
        }
      }
      setModalOpen(false);
      setEditingTask(null);
      await fetchTasks();
    } catch (e) {
      console.error("Erro ao salvar tarefa:", e);
    } finally {
      setSaving(false);
    }
  }, [editingTask, fetchTasks]);

  const handleDeleteTask = useCallback(async (taskId) => {
    const ok = window.confirm("Excluir esta tarefa? Esta ação não pode ser desfeita.");
    if (!ok) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      await fetchTasks();
    } catch (e) {
      console.error("Erro ao excluir tarefa:", e);
    }
  }, [fetchTasks]);

  const openNewTaskModal = useCallback((colId) => {
    setEditingTask(null);
    setModalStatus(COL_TO_STATUS[colId] || "BACKLOG");
    setModalOpen(true);
  }, []);

  const openEditModal = useCallback((task) => {
    setEditingTask(task);
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
    return (
      <div aria-label="Carregando quadro Kanban" aria-busy="true">
        <div className="mb-6">
          <div className="skeleton h-7 w-24 mb-2" />
          <div className="skeleton h-4 w-64" />
        </div>
        <div className="flex gap-4 overflow-x-hidden">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="w-72 shrink-0">
              <div className="flex items-center gap-2 mb-3 px-1">
                <div className="skeleton w-2.5 h-2.5 rounded-full" />
                <div className="skeleton h-4 w-24" />
              </div>
              <div className="bg-slate-50/50 rounded-lg p-2 flex flex-col gap-2.5 min-h-[200px]">
                {Array.from({ length: i % 2 === 0 ? 2 : 3 }).map((_, j) => (
                  <div key={j} className="bg-white rounded-lg border border-slate-200 p-3.5">
                    <div className="skeleton h-3 w-16 mb-3" />
                    <div className="skeleton h-4 w-full mb-1.5" />
                    <div className="skeleton h-3 w-3/4 mb-3" />
                    <div className="flex justify-between">
                      <div className="skeleton h-3 w-20" />
                      <div className="skeleton h-3 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
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
        onNewTask={() => { setEditingTask(null); setModalStatus("BACKLOG"); setModalOpen(true); }}
      />

      <div className="flex items-center gap-4 mb-4 text-xs text-slate-400 dark:text-slate-500 flex-wrap">
        <span>{totalTasks} tarefas no total</span>
        <span className="w-px h-3 bg-slate-200 dark:bg-slate-700" />
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
            onEditTask={openEditModal}
            onDeleteTask={handleDeleteTask}
          />
        ))}
      </div>

      {modalOpen && (
        <NewTaskModal
          initialStatus={modalStatus}
          task={editingTask}
          users={users}
          allTasks={allTasksFlat}
          onConfirm={handleSaveTask}
          onClose={() => { setModalOpen(false); setEditingTask(null); }}
          loading={saving}
        />
      )}
    </>
  );
}
