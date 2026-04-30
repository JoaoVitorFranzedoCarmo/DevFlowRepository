// src/components/kanban/NewTaskModal.jsx
import { useState, useEffect, useRef, useId, useMemo } from "react";

const statusOptions = [
  { value: "BACKLOG",   label: "Backlog" },
  { value: "AFAZER",    label: "A Fazer" },
  { value: "PROGRESSO", label: "Em Progresso" },
  { value: "REVISAO",   label: "Em Revisão" },
  { value: "CONCLUIDO", label: "Concluído" },
];

const priorityOptions = [
  { value: "CRITICA", label: "Crítica" },
  { value: "ALTA",    label: "Alta" },
  { value: "MEDIA",   label: "Média" },
  { value: "BAIXA",   label: "Baixa" },
];

function computeQuadrant(urgency, importance) {
  if (urgency >= 3 && importance >= 3) return "FAZER";
  if (urgency < 3 && importance >= 3) return "AGENDAR";
  if (urgency >= 3 && importance < 3) return "DELEGAR";
  return "ELIMINAR";
}

const QUADRANT_LABEL = {
  FAZER: "Fazer agora", AGENDAR: "Agendar", DELEGAR: "Delegar", ELIMINAR: "Eliminar",
};

export default function NewTaskModal({
  initialStatus,
  task,
  users = [],
  allTasks = [],
  onConfirm,
  onClose,
  loading,
  showPrioritization = false,
}) {
  const editing = !!task;
  const titleId = useId();
  const firstFocusRef = useRef(null);
  const existingPrior = task?.prioritization || null;

  const [title,    setTitle]    = useState(task?.title    ?? "");
  const [desc,     setDesc]     = useState(task?.desc     ?? "");
  const [status,   setStatus]   = useState(task?.statusRaw ?? initialStatus ?? "BACKLOG");
  const [priority, setPriority] = useState(task?.priorityRaw ?? "MEDIA");
  const [tagsRaw,  setTagsRaw]  = useState(task?.tags?.join(", ") ?? "");
  const [dueDate,  setDueDate]  = useState(task?.dueDateRaw ?? "");
  const [assigneeId, setAssigneeId] = useState(task?.assigneeId ?? "");
  const [estimatedHours, setEstimatedHours] = useState(task?.estimatedHours ?? 2);
  const [dependencyIds, setDependencyIds] = useState(task?.dependencyIds ?? []);
  const [depFilter, setDepFilter] = useState("");
  const [priorOpen, setPriorOpen] = useState(showPrioritization || !!existingPrior);
  const [urgency, setUrgency]       = useState(existingPrior?.urgency ?? 3);
  const [importance, setImportance] = useState(existingPrior?.importance ?? 3);
  const [prValue, setPrValue]       = useState(existingPrior?.value ?? 5);
  const [effort, setEffort]         = useState(existingPrior?.effort ?? 5);
  const currentQuadrant = computeQuadrant(Number(urgency), Number(importance));

  useEffect(() => { firstFocusRef.current?.focus(); }, []);

  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const candidateDeps = useMemo(() => {
    const q = depFilter.toLowerCase();
    return allTasks
      .filter((t) => !task || t.id !== task.id)
      .filter((t) => !q || t.title.toLowerCase().includes(q));
  }, [allTasks, depFilter, task]);

  function toggleDep(id) {
    setDependencyIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const tags = tagsRaw.split(",").map((t) => t.trim()).filter(Boolean);
    const payload = {
      title, desc, status, priority, tags,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      assigneeId: assigneeId || null,
      estimatedHours: Number(estimatedHours) || 0,
      dependencies: dependencyIds,
    };
    if (priorOpen) {
      payload.prioritization = {
        urgency: Number(urgency),
        importance: Number(importance),
        value: Number(prValue),
        effort: Number(effort),
        quadrant: currentQuadrant,
      };
    }
    onConfirm(payload);
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      aria-hidden="false"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between sticky top-0 bg-white dark:bg-slate-800 z-10">
          <h2 id={titleId} className="text-sm font-semibold text-[#1B2A4A] dark:text-slate-100">
            {editing ? "Editar Tarefa" : "Nova Tarefa"}
          </h2>
          <button
            onClick={onClose}
            aria-label="Fechar modal"
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded p-0.5"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div>
            <label htmlFor="task-title" className="text-[12px] font-medium text-[#1B2A4A] dark:text-slate-200 mb-1.5 block">
              Título <span aria-hidden="true">*</span>
            </label>
            <input
              id="task-title"
              ref={firstFocusRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              minLength={2}
              placeholder="Título da tarefa"
              className="w-full py-2 px-3 border border-slate-200 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="task-desc" className="text-[12px] font-medium text-[#1B2A4A] dark:text-slate-200 mb-1.5 block">Descrição</label>
            <textarea
              id="task-desc"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={3}
              placeholder="Detalhes da tarefa..."
              className="w-full py-2 px-3 border border-slate-200 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="task-status" className="text-[12px] font-medium text-[#1B2A4A] dark:text-slate-200 mb-1.5 block">Status</label>
              <select
                id="task-status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full py-2 px-3 border border-slate-200 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                {statusOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="task-priority" className="text-[12px] font-medium text-[#1B2A4A] dark:text-slate-200 mb-1.5 block">Prioridade</label>
              <select
                id="task-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full py-2 px-3 border border-slate-200 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                {priorityOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="task-assignee" className="text-[12px] font-medium text-[#1B2A4A] dark:text-slate-200 mb-1.5 block">Responsável</label>
              <select
                id="task-assignee"
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="w-full py-2 px-3 border border-slate-200 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                <option value="">— Sem responsável —</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>{u.name} {u.role ? `(${u.role})` : ""}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="task-hours" className="text-[12px] font-medium text-[#1B2A4A] dark:text-slate-200 mb-1.5 block">Horas estimadas</label>
              <input
                id="task-hours"
                type="number"
                min="0"
                step="0.5"
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(e.target.value)}
                className="w-full py-2 px-3 border border-slate-200 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="task-tags" className="text-[12px] font-medium text-[#1B2A4A] dark:text-slate-200 mb-1.5 block">
                Tags
                <span className="text-slate-400 font-normal ml-1">(separadas por vírgula)</span>
              </label>
              <input
                id="task-tags"
                type="text"
                value={tagsRaw}
                onChange={(e) => setTagsRaw(e.target.value)}
                placeholder="ex: bug, frontend"
                className="w-full py-2 px-3 border border-slate-200 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>
            <div>
              <label htmlFor="task-due" className="text-[12px] font-medium text-[#1B2A4A] dark:text-slate-200 mb-1.5 block">Prazo</label>
              <input
                id="task-due"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full py-2 px-3 border border-slate-200 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="text-[12px] font-medium text-[#1B2A4A] dark:text-slate-200 mb-1.5 block">
              Dependências
              <span className="text-slate-400 font-normal ml-1">(tarefas que bloqueiam esta)</span>
            </label>
            <input
              type="text"
              value={depFilter}
              onChange={(e) => setDepFilter(e.target.value)}
              placeholder="Filtrar tarefas..."
              className="w-full py-2 px-3 mb-2 border border-slate-200 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 rounded-md text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <div className="max-h-40 overflow-y-auto border border-slate-200 dark:border-slate-600 rounded-md bg-slate-50 dark:bg-slate-900/50 p-2 flex flex-col gap-1">
              {candidateDeps.length === 0 && (
                <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-3">Nenhuma tarefa disponível</p>
              )}
              {candidateDeps.map((t) => (
                <label
                  key={t.id}
                  className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-white dark:hover:bg-slate-800 cursor-pointer text-xs text-slate-700 dark:text-slate-200"
                >
                  <input
                    type="checkbox"
                    checked={dependencyIds.includes(t.id)}
                    onChange={() => toggleDep(t.id)}
                    className="accent-blue-600"
                  />
                  <span className="truncate">{t.title}</span>
                  <span className="ml-auto text-[10px] text-slate-400">{t.statusRaw}</span>
                </label>
              ))}
            </div>
            {dependencyIds.length > 0 && (
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
                {dependencyIds.length} dependência(s) selecionada(s)
              </p>
            )}
          </div>

          <div className="border border-slate-200 dark:border-slate-700 rounded-md">
            <button
              type="button"
              onClick={() => setPriorOpen((v) => !v)}
              className="w-full flex items-center justify-between px-3 py-2 text-[12px] font-medium text-[#1B2A4A] dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-md"
            >
              <span className="flex items-center gap-2">
                Priorização (Eisenhower)
                {priorOpen && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                    {QUADRANT_LABEL[currentQuadrant]}
                  </span>
                )}
              </span>
              <span className="text-slate-400">{priorOpen ? "−" : "+"}</span>
            </button>
            {priorOpen && (
              <div className="p-3 pt-0 grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-500 dark:text-slate-400">Urgência (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value)}
                    className="w-full py-1.5 px-2 border border-slate-200 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 rounded-md text-sm outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 dark:text-slate-400">Importância (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={importance}
                    onChange={(e) => setImportance(e.target.value)}
                    className="w-full py-1.5 px-2 border border-slate-200 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 rounded-md text-sm outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 dark:text-slate-400">Valor (1-10)</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={prValue}
                    onChange={(e) => setPrValue(e.target.value)}
                    className="w-full py-1.5 px-2 border border-slate-200 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 rounded-md text-sm outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 dark:text-slate-400">Esforço (1-10)</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={effort}
                    onChange={(e) => setEffort(e.target.value)}
                    className="w-full py-1.5 px-2 border border-slate-200 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 rounded-md text-sm outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-slate-500 dark:text-slate-300 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              aria-busy={loading}
              className="px-5 py-2 bg-blue-600 text-white rounded-md text-sm font-semibold hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60 transition-colors flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                    <path d="M21 12a9 9 0 11-6.219-8.56" />
                  </svg>
                  Salvando...
                </>
              ) : editing ? "Salvar Alterações" : "Criar Tarefa"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
