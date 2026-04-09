// src/components/documentacao/DocList.jsx
import { useState, useEffect, useCallback } from "react";
import api from "../../services/api";
import { SearchIcon } from "../../icons/SidebarIcons";
import NewDocModal from "./NewDocModal";

const docTypeConfig = {
  OPENAPI:  { label: "API",      color: "bg-purple-100 text-purple-700", dot: "bg-purple-500" },
  TECNICA:  { label: "Técnica",  color: "bg-blue-100 text-blue-700",     dot: "bg-blue-500" },
  MANUAL:   { label: "Manual",   color: "bg-amber-100 text-amber-700",   dot: "bg-amber-500" },
};

const docStatusConfig = {
  ATUALIZADO:    { label: "Atualizado",    color: "bg-green-100 text-green-700" },
  DESATUALIZADO: { label: "Desatualizado", color: "bg-red-100 text-red-700" },
  RASCUNHO:      { label: "Rascunho",      color: "bg-slate-100 text-slate-500" },
};

export default function DocList() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("todos");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchDocs = useCallback(async () => {
    try {
      const params = {};
      if (search) params.search = search;
      if (filterType !== "todos") params.type = filterType;
      if (filterStatus !== "todos") params.status = filterStatus;
      const { data } = await api.get("/documents", { params });
      setDocs(data);
    } catch (err) {
      console.error("Erro ao carregar documentos:", err);
    } finally {
      setLoading(false);
    }
  }, [search, filterType, filterStatus]);

  useEffect(() => { fetchDocs(); }, [fetchDocs]);

  async function handleCreate(formData) {
    setSaving(true);
    try {
      await api.post("/documents", formData);
      setModalOpen(false);
      await fetchDocs();
    } catch (err) {
      console.error("Erro ao criar documento:", err);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Excluir este documento?")) return;
    try {
      await api.delete(`/documents/${id}`);
      await fetchDocs();
    } catch (err) {
      console.error("Erro ao excluir documento:", err);
    }
  }

  const TypeIcon = ({ type }) => {
    if (type === "OPENAPI") return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="1.8" strokeLinecap="round"><path d="M18 20V10" /><path d="M12 20V4" /><path d="M6 20v-6" /></svg>;
    if (type === "MANUAL") return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="1.8" strokeLinecap="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" /></svg>;
    return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>;
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-[#1B2A4A]">Documentos Gerados</h3>
        <button
          onClick={() => setModalOpen(true)}
          className="px-3.5 py-1.5 bg-blue-600 text-white rounded-md text-[12px] font-semibold hover:bg-blue-700 transition-colors flex items-center gap-1.5"
        >
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
          <span className="absolute left-3 top-1/2 -translate-y-1/2"><SearchIcon /></span>
        </div>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-md text-[12px] bg-white text-slate-600 cursor-pointer">
          <option value="todos">Todos os tipos</option>
          <option value="OPENAPI">API REST</option>
          <option value="TECNICA">Técnica</option>
          <option value="MANUAL">Manual</option>
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-md text-[12px] bg-white text-slate-600 cursor-pointer">
          <option value="todos">Todos os status</option>
          <option value="ATUALIZADO">Atualizado</option>
          <option value="DESATUALIZADO">Desatualizado</option>
          <option value="RASCUNHO">Rascunho</option>
        </select>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-400 text-sm">Carregando documentos...</div>
      ) : docs.length === 0 ? (
        <div className="py-12 text-center text-slate-400 text-sm">
          Nenhum documento encontrado.{" "}
          <button onClick={() => setModalOpen(true)} className="text-blue-600 hover:underline">Criar o primeiro</button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-[1fr_80px_70px_90px_100px_90px_80px] gap-2 px-3 py-2 text-[11px] text-slate-400 font-medium border-b border-slate-100">
            <span>Documento</span>
            <span className="text-center">Tipo</span>
            <span className="text-center">Formato</span>
            <span className="text-center">Versão</span>
            <span className="text-center">Commit</span>
            <span className="text-center">Status</span>
            <span className="text-center">Ações</span>
          </div>

          {docs.map((doc) => {
            const type = docTypeConfig[doc.type] || docTypeConfig.TECNICA;
            const status = docStatusConfig[doc.status] || docStatusConfig.RASCUNHO;
            const initials = doc.author?.name
              ? doc.author.name.split(" ").map((n) => n[0]).join("").slice(0, 2)
              : "?";

            return (
              <div key={doc.id} className="grid grid-cols-[1fr_80px_70px_90px_100px_90px_80px] gap-2 px-3 py-3 items-center text-[12px] border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                    <TypeIcon type={doc.type} />
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium text-[#1B2A4A] truncate">{doc.title}</div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div className="w-4 h-4 rounded-full bg-[#1B2A4A] text-white flex items-center justify-center text-[7px] font-semibold">{initials}</div>
                      <span className="text-[10px] text-slate-400">
                        {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString("pt-BR") : "—"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold ${type.color}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${type.dot}`} />{type.label}
                  </span>
                </div>

                <div className="text-center">
                  <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-[10px] font-medium">{doc.format}</span>
                </div>

                <div className="text-center font-mono text-[11px] text-slate-600">{doc.version}</div>
                <div className="text-center font-mono text-[11px] text-blue-600">{doc.codeVersion || "—"}</div>

                <div className="text-center">
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${status.color}`}>{status.label}</span>
                </div>

                <div className="flex items-center justify-center gap-1.5">
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="p-1 rounded hover:bg-slate-100 transition-colors text-slate-400 hover:text-red-600"
                    title="Excluir"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                      <path d="M10 11v6" /><path d="M14 11v6" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </>
      )}

      {modalOpen && (
        <NewDocModal
          onConfirm={handleCreate}
          onClose={() => setModalOpen(false)}
          loading={saving}
        />
      )}
    </div>
  );
}
