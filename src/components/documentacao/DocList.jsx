// src/components/documentacao/DocList.jsx

import { useState } from "react";
import { generatedDocs, docTypeConfig, docStatusConfig } from "../../data/documentacaoData";
import { SearchIcon } from "../../icons/SidebarIcons";

export default function DocList() {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("todos");
  const [filterStatus, setFilterStatus] = useState("todos");

  const filtered = generatedDocs.filter((d) => {
    const matchSearch = d.title.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "todos" || d.type === filterType;
    const matchStatus = filterStatus === "todos" || d.status === filterStatus;
    return matchSearch && matchType && matchStatus;
  });

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-[#1B2A4A]">Documentos Gerados</h3>
        <button className="px-3.5 py-1.5 bg-blue-600 text-white rounded-md text-[12px] font-semibold hover:bg-blue-700 transition-colors flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="12" y1="18" x2="12" y2="12" />
            <line x1="9" y1="15" x2="15" y2="15" />
          </svg>
          Gerar Novo
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Buscar documentos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full py-2 pl-9 pr-3.5 border border-slate-200 rounded-md text-sm outline-none focus:border-blue-500 bg-white"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2">
            <SearchIcon />
          </span>
        </div>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-md text-[12px] bg-white text-slate-600 cursor-pointer">
          <option value="todos">Todos os tipos</option>
          <option value="openapi">API REST</option>
          <option value="tecnica">Técnica</option>
          <option value="manual">Manual</option>
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-md text-[12px] bg-white text-slate-600 cursor-pointer">
          <option value="todos">Todos os status</option>
          <option value="atualizado">Atualizado</option>
          <option value="desatualizado">Desatualizado</option>
          <option value="rascunho">Rascunho</option>
        </select>
      </div>

      {/* Table */}
      <div className="grid grid-cols-[1fr_80px_70px_90px_100px_90px_80px] gap-2 px-3 py-2 text-[11px] text-slate-400 font-medium border-b border-slate-100">
        <span>Documento</span>
        <span className="text-center">Tipo</span>
        <span className="text-center">Formato</span>
        <span className="text-center">Versão</span>
        <span className="text-center">Commit</span>
        <span className="text-center">Status</span>
        <span className="text-center">Ações</span>
      </div>

      {filtered.map((doc) => {
        const type = docTypeConfig[doc.type];
        const status = docStatusConfig[doc.status];
        const initials = doc.author.split(" ").map((n) => n[0]).join("");

        return (
          <div key={doc.id} className="grid grid-cols-[1fr_80px_70px_90px_100px_90px_80px] gap-2 px-3 py-3 items-center text-[12px] border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors cursor-pointer">
            {/* Name + author + date */}
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                {doc.type === "openapi" ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="1.8" strokeLinecap="round"><path d="M18 20V10" /><path d="M12 20V4" /><path d="M6 20v-6" /></svg>
                ) : doc.type === "manual" ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="1.8" strokeLinecap="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" /></svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
                )}
              </div>
              <div className="min-w-0">
                <div className="font-medium text-[#1B2A4A] truncate">{doc.title}</div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-4 h-4 rounded-full bg-[#1B2A4A] text-white flex items-center justify-center text-[7px] font-semibold">{initials}</div>
                  <span className="text-[10px] text-slate-400">{doc.generatedAt}</span>
                </div>
              </div>
            </div>

            {/* Type */}
            <div className="text-center">
              <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold ${type.color}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${type.dot}`} />
                {type.label}
              </span>
            </div>

            {/* Format */}
            <div className="text-center">
              <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-[10px] font-medium">{doc.format}</span>
            </div>

            {/* Version */}
            <div className="text-center font-mono text-[11px] text-slate-600">{doc.version}</div>

            {/* Commit */}
            <div className="text-center font-mono text-[11px] text-blue-600">{doc.codeVersion}</div>

            {/* Status */}
            <div className="text-center">
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${status.color}`}>{status.label}</span>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-center gap-1.5">
              <button className="p-1 rounded hover:bg-slate-100 transition-colors text-slate-400 hover:text-blue-600" title="Visualizar">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
              </button>
              <button className="p-1 rounded hover:bg-slate-100 transition-colors text-slate-400 hover:text-green-600" title="Regenerar">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" /></svg>
              </button>
              <button className="p-1 rounded hover:bg-slate-100 transition-colors text-slate-400 hover:text-amber-600" title="Download">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
