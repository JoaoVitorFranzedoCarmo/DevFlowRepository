// src/components/documentacao/NewDocModal.jsx
import { useState } from "react";

const typeOptions = [
  { value: "OPENAPI", label: "API REST (OpenAPI)" },
  { value: "TECNICA", label: "Técnica" },
  { value: "MANUAL", label: "Manual" },
];

const formatOptions = [
  { value: "HTML", label: "HTML" },
  { value: "PDF", label: "PDF" },
  { value: "MARKDOWN", label: "Markdown" },
];

const statusOptions = [
  { value: "RASCUNHO", label: "Rascunho" },
  { value: "ATUALIZADO", label: "Atualizado" },
  { value: "DESATUALIZADO", label: "Desatualizado" },
];

export default function NewDocModal({ onConfirm, onClose, loading }) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("TECNICA");
  const [format, setFormat] = useState("HTML");
  const [status, setStatus] = useState("RASCUNHO");
  const [version, setVersion] = useState("v1.0.0");

  function handleSubmit(e) {
    e.preventDefault();
    onConfirm({ title, type, format, status, version });
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl border border-slate-200 shadow-xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[#1B2A4A]">Novo Documento</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div>
            <label className="text-[12px] font-medium text-[#1B2A4A] mb-1.5 block">Título *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Nome do documento"
              className="w-full py-2 px-3 border border-slate-200 rounded-md text-sm outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[12px] font-medium text-[#1B2A4A] mb-1.5 block">Tipo</label>
              <select value={type} onChange={(e) => setType(e.target.value)} className="w-full py-2 px-3 border border-slate-200 rounded-md text-sm bg-white text-slate-600 outline-none focus:border-blue-500 cursor-pointer">
                {typeOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[12px] font-medium text-[#1B2A4A] mb-1.5 block">Formato</label>
              <select value={format} onChange={(e) => setFormat(e.target.value)} className="w-full py-2 px-3 border border-slate-200 rounded-md text-sm bg-white text-slate-600 outline-none focus:border-blue-500 cursor-pointer">
                {formatOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[12px] font-medium text-[#1B2A4A] mb-1.5 block">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full py-2 px-3 border border-slate-200 rounded-md text-sm bg-white text-slate-600 outline-none focus:border-blue-500 cursor-pointer">
                {statusOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[12px] font-medium text-[#1B2A4A] mb-1.5 block">Versão</label>
              <input
                type="text"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                placeholder="v1.0.0"
                className="w-full py-2 px-3 border border-slate-200 rounded-md text-sm outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-slate-500 hover:text-slate-700 transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="px-5 py-2 bg-blue-600 text-white rounded-md text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60">
              {loading ? "Criando..." : "Criar Documento"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
