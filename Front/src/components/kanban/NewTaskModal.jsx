// src/components/kanban/NewTaskModal.jsx
import { useState, useEffect, useRef, useId } from "react";

const statusOptions = [
  { value: "BACKLOG",    label: "Backlog" },
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

export default function NewTaskModal({ initialStatus, task, onConfirm, onClose, loading }) {
  const editing = !!task;
  const titleId = useId();
  const firstFocusRef = useRef(null);

  const [title,    setTitle]    = useState(task?.title    ?? "");
  const [desc,     setDesc]     = useState(task?.desc     ?? "");
  const [status,   setStatus]   = useState(task?.statusRaw ?? initialStatus ?? "BACKLOG");
  const [priority, setPriority] = useState(task?.priorityRaw ?? "MEDIA");
  const [tagsRaw,  setTagsRaw]  = useState(task?.tags?.join(", ") ?? "");
  const [dueDate,  setDueDate]  = useState(task?.dueDateRaw ?? "");

  // Focus first field on open
  useEffect(() => {
    firstFocusRef.current?.focus();
  }, []);

  // Close on Escape
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  function handleSubmit(e) {
    e.preventDefault();
    const tags = tagsRaw.split(",").map((t) => t.trim()).filter(Boolean);
    onConfirm({
      title, desc, status, priority, tags,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
    });
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
        className="bg-white rounded-xl border border-slate-200 shadow-xl w-full max-w-lg animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 id={titleId} className="text-sm font-semibold text-[#1B2A4A]">
            {editing ? "Editar Tarefa" : "Nova Tarefa"}
          </h2>
          <button
            onClick={onClose}
            aria-label="Fechar modal"
            className="text-slate-400 hover:text-slate-600 transition-colors rounded p-0.5"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div>
            <label htmlFor="task-title" className="text-[12px] font-medium text-[#1B2A4A] mb-1.5 block">
              Título <span aria-hidden="true">*</span>
              <span className="sr-only">(obrigatório)</span>
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
              className="w-full py-2 px-3 border border-slate-200 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="task-desc" className="text-[12px] font-medium text-[#1B2A4A] mb-1.5 block">Descrição</label>
            <textarea
              id="task-desc"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={3}
              placeholder="Detalhes da tarefa..."
              className="w-full py-2 px-3 border border-slate-200 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="task-status" className="text-[12px] font-medium text-[#1B2A4A] mb-1.5 block">Status</label>
              <select
                id="task-status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full py-2 px-3 border border-slate-200 rounded-md text-sm bg-white text-slate-600 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                {statusOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="task-priority" className="text-[12px] font-medium text-[#1B2A4A] mb-1.5 block">Prioridade</label>
              <select
                id="task-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full py-2 px-3 border border-slate-200 rounded-md text-sm bg-white text-slate-600 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                {priorityOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="task-tags" className="text-[12px] font-medium text-[#1B2A4A] mb-1.5 block">
                Tags
                <span className="text-slate-400 font-normal ml-1">(separadas por vírgula)</span>
              </label>
              <input
                id="task-tags"
                type="text"
                value={tagsRaw}
                onChange={(e) => setTagsRaw(e.target.value)}
                placeholder="ex: bug, frontend"
                className="w-full py-2 px-3 border border-slate-200 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>
            <div>
              <label htmlFor="task-due" className="text-[12px] font-medium text-[#1B2A4A] mb-1.5 block">Prazo</label>
              <input
                id="task-due"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full py-2 px-3 border border-slate-200 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
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
