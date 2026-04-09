// src/components/kanban/NewTaskModal.jsx
import { useState } from "react";

const statusOptions = [
  { value: "BACKLOG",   label: "Backlog" },
  { value: "AFAZER",   label: "A Fazer" },
  { value: "PROGRESSO",label: "Em Progresso" },
  { value: "REVISAO",  label: "Em Revisão" },
  { value: "CONCLUIDO",label: "Concluído" },
];

const priorityOptions = [
  { value: "CRITICA", label: "Crítica" },
  { value: "ALTA",    label: "Alta" },
  { value: "MEDIA",   label: "Média" },
  { value: "BAIXA",   label: "Baixa" },
];

// task → modo edição; undefined → modo criação
export default function NewTaskModal({ initialStatus, task, onConfirm, onClose, loading }) {
  const editing = !!task;

  const [title,    setTitle]    = useState(task?.title    ?? "");
  const [desc,     setDesc]     = useState(task?.desc     ?? "");
  const [status,   setStatus]   = useState(task?.statusRaw ?? initialStatus ?? "BACKLOG");
  const [priority, setPriority] = useState(task?.priorityRaw ?? "MEDIA");
  const [tagsRaw,  setTagsRaw]  = useState(task?.tags?.join(", ") ?? "");
  const [dueDate,  setDueDate]  = useState(task?.dueDateRaw ?? "");

  function handleSubmit(e) {
    e.preventDefault();
    const tags = tagsRaw.split(",").map((t) => t.trim()).filter(Boolean);
    onConfirm({
      title, desc, status, priority, tags,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
    });
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl border border-slate-200 shadow-xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[#1B2A4A]">
            {editing ? "Editar Tarefa" : "Nova Tarefa"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div>
            <label className="text-[12px] font-medium text-[#1B2A4A] mb-1.5 block">Título *</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
              required minLength={2} placeholder="Título da tarefa"
              className="w-full py-2 px-3 border border-slate-200 rounded-md text-sm outline-none focus:border-blue-500 transition-colors" />
          </div>

          <div>
            <label className="text-[12px] font-medium text-[#1B2A4A] mb-1.5 block">Descrição</label>
            <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={3}
              placeholder="Detalhes da tarefa..."
              className="w-full py-2 px-3 border border-slate-200 rounded-md text-sm outline-none focus:border-blue-500 transition-colors resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[12px] font-medium text-[#1B2A4A] mb-1.5 block">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)}
                className="w-full py-2 px-3 border border-slate-200 rounded-md text-sm bg-white text-slate-600 outline-none focus:border-blue-500 cursor-pointer">
                {statusOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[12px] font-medium text-[#1B2A4A] mb-1.5 block">Prioridade</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value)}
                className="w-full py-2 px-3 border border-slate-200 rounded-md text-sm bg-white text-slate-600 outline-none focus:border-blue-500 cursor-pointer">
                {priorityOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[12px] font-medium text-[#1B2A4A] mb-1.5 block">Tags (separadas por vírgula)</label>
              <input type="text" value={tagsRaw} onChange={(e) => setTagsRaw(e.target.value)}
                placeholder="ex: bug, frontend"
                className="w-full py-2 px-3 border border-slate-200 rounded-md text-sm outline-none focus:border-blue-500 transition-colors" />
            </div>
            <div>
              <label className="text-[12px] font-medium text-[#1B2A4A] mb-1.5 block">Prazo</label>
              <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}
                className="w-full py-2 px-3 border border-slate-200 rounded-md text-sm outline-none focus:border-blue-500 transition-colors" />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-slate-500 hover:text-slate-700">Cancelar</button>
            <button type="submit" disabled={loading}
              className="px-5 py-2 bg-blue-600 text-white rounded-md text-sm font-semibold hover:bg-blue-700 disabled:opacity-60">
              {loading ? "Salvando..." : editing ? "Salvar Alterações" : "Criar Tarefa"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
