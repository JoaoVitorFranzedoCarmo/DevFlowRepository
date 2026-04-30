// src/components/PriorizacaoPage.jsx
import { useState, useEffect, useCallback, useMemo } from "react";
import api from "../services/api";
import { mapTask } from "../utils/taskMapper";
import PrioritySummary from "./priorizacao/PrioritySummary";
import EisenhowerMatrix from "./priorizacao/EisenhowerMatrix";
import ValueEffortChart from "./priorizacao/ValueEffortChart";
import PriorityRanking from "./priorizacao/PriorityRanking";
import DependencyMap from "./priorizacao/DependencyMap";
import NewTaskModal from "./kanban/NewTaskModal";

const views = [
  { key: "eisenhower", label: "Matriz de Eisenhower" },
  { key: "valueEffort", label: "Value vs. Effort" },
  { key: "ranking", label: "Ranking" },
  { key: "dependencias", label: "Dependências" },
];

export default function PriorizacaoPage() {
  const [activeView, setActiveView] = useState("eisenhower");
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchAll = useCallback(async () => {
    try {
      const [{ data: rawTasks }, { data: rawUsers }] = await Promise.all([
        api.get("/tasks"),
        api.get("/users").catch(() => ({ data: [] })),
      ]);
      setTasks((Array.isArray(rawTasks) ? rawTasks : []).map(mapTask));
      setUsers(Array.isArray(rawUsers) ? rawUsers : []);
    } catch (e) {
      console.error("Erro ao carregar priorização:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleEdit = useCallback((task) => {
    setEditingTask(task);
    setModalOpen(true);
  }, []);

  const handleSave = useCallback(async (data) => {
    if (!editingTask) return;
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
      await api.put(`/tasks/${editingTask.id}`, payload);
      if (Array.isArray(data.dependencies)) {
        await api.put(`/tasks/${editingTask.id}/dependencies`, { targetTaskIds: data.dependencies });
      }
      if (data.prioritization) {
        await api.put(`/tasks/${editingTask.id}/prioritization`, data.prioritization);
      }
      setModalOpen(false);
      setEditingTask(null);
      await fetchAll();
    } catch (e) {
      console.error("Erro ao salvar:", e);
    } finally {
      setSaving(false);
    }
  }, [editingTask, fetchAll]);

  const prioritizedTasks = useMemo(() => tasks.filter((t) => t.prioritization), [tasks]);

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-[#1B2A4A] dark:text-slate-100">Priorização</h1>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-0.5">
            Mesmas tarefas do Kanban — classifique por diferentes métodos
          </p>
        </div>
      </div>

      <PrioritySummary tasks={tasks} prioritized={prioritizedTasks} />

      <div className="flex gap-0 mb-6 border-b-2 border-slate-200 dark:border-slate-700 overflow-x-auto">
        {views.map((view) => (
          <button
            key={view.key}
            onClick={() => setActiveView(view.key)}
            className={`px-5 py-2.5 text-sm transition-all -mb-[2px] whitespace-nowrap ${
              activeView === view.key
                ? "text-blue-600 font-semibold border-b-2 border-blue-600"
                : "text-slate-400 dark:text-slate-500 font-normal border-b-2 border-transparent hover:text-slate-600"
            }`}
          >
            {view.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-slate-400 text-sm">Carregando tarefas...</div>
      ) : (
        <>
          {activeView === "eisenhower" && <EisenhowerMatrix tasks={tasks} onEdit={handleEdit} />}
          {activeView === "valueEffort" && <ValueEffortChart tasks={prioritizedTasks} onEdit={handleEdit} />}
          {activeView === "ranking" && <PriorityRanking tasks={prioritizedTasks} onEdit={handleEdit} />}
          {activeView === "dependencias" && <DependencyMap tasks={tasks} onEdit={handleEdit} />}
        </>
      )}

      {tasks.length > 0 && prioritizedTasks.length === 0 && (activeView === "valueEffort" || activeView === "ranking") && (
        <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md text-amber-800 dark:text-amber-200 text-sm">
          Nenhuma tarefa com pontuação WSJF definida. Clique numa tarefa para abrir o modal e preencher a seção "Priorização".
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-2">
        <span className="text-xs text-slate-400 dark:text-slate-500">Definir priorização:</span>
        {tasks.slice(0, 20).map((t) => (
          <button
            key={t.id}
            onClick={() => handleEdit(t)}
            className={`px-2 py-1 rounded-md text-xs border transition-colors ${
              t.prioritization
                ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700"
                : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700"
            } hover:border-blue-400`}
          >
            {t.title}
            {t.quadrant && <span className="ml-1 text-[10px] opacity-70">· {t.quadrant}</span>}
          </button>
        ))}
      </div>

      {modalOpen && editingTask && (
        <NewTaskModal
          task={editingTask}
          users={users}
          allTasks={tasks}
          showPrioritization={true}
          onConfirm={handleSave}
          onClose={() => { setModalOpen(false); setEditingTask(null); }}
          loading={saving}
        />
      )}
    </>
  );
}
