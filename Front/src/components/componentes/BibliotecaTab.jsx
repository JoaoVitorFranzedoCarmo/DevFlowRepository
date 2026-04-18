// src/components/componentes/BibliotecaTab.jsx
import { useState, useEffect, useCallback } from "react";
import api from "../../services/api";
import { SearchIcon } from "../../icons/SidebarIcons";
import StatsBar from "./StatsBar";
import ComponentCard from "./ComponentCard";
import ComponentDetail from "./ComponentDetail";
import ComponentModal from "./ComponentModal";

const categoriesDefault = ["Todos", "Autenticação", "CRUD", "UI Components", "Integração API", "Formulários", "Dashboard"];
const languagesDefault = ["Todas", "React", "Python", "Java", "C#", "Node.js", "TypeScript", "JavaScript"];

export default function BibliotecaTab() {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selCat, setSelCat] = useState("Todos");
  const [selLang, setSelLang] = useState("Todas");
  const [selectedComp, setSelectedComp] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingComp, setEditingComp] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchComponents = useCallback(async () => {
    try {
      const { data } = await api.get("/components");
      setComponents(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Erro ao carregar componentes:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchComponents(); }, [fetchComponents]);

  const filtered = components.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.desc || "").toLowerCase().includes(search.toLowerCase());
    const matchCat = selCat === "Todos" || c.category === selCat;
    const matchLang = selLang === "Todas" || c.lang === selLang;
    return matchSearch && matchCat && matchLang;
  });

  const handleSave = async (payload) => {
    setSaving(true);
    try {
      if (editingComp) {
        await api.put(`/components/${editingComp.id}`, payload);
      } else {
        await api.post("/components", payload);
      }
      setModalOpen(false);
      setEditingComp(null);
      await fetchComponents();
    } catch (e) {
      console.error("Erro ao salvar componente:", e);
      alert(e.response?.data?.message || "Erro ao salvar componente");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Excluir este componente?")) return;
    try {
      await api.delete(`/components/${id}`);
      setSelectedComp(null);
      await fetchComponents();
    } catch (e) {
      console.error("Erro ao excluir componente:", e);
    }
  };

  if (selectedComp) {
    return (
      <ComponentDetail
        comp={selectedComp}
        onBack={() => setSelectedComp(null)}
        onEdit={() => { setEditingComp(selectedComp); setModalOpen(true); }}
        onDelete={() => handleDelete(selectedComp.id)}
      />
    );
  }

  return (
    <>
      <div className="flex gap-3 mb-5 flex-wrap items-center">
        <div className="flex-1 min-w-[250px] relative">
          <input
            type="text"
            placeholder="Pesquisar componentes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full py-2.5 pl-9 pr-3.5 border border-slate-200 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2">
            <SearchIcon />
          </span>
        </div>

        <select
          value={selCat}
          onChange={(e) => setSelCat(e.target.value)}
          className="px-3.5 py-2.5 border border-slate-200 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 rounded-md text-[13px] bg-white text-slate-600 cursor-pointer"
        >
          {categoriesDefault.map((c) => <option key={c}>{c}</option>)}
        </select>

        <select
          value={selLang}
          onChange={(e) => setSelLang(e.target.value)}
          className="px-3.5 py-2.5 border border-slate-200 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 rounded-md text-[13px] bg-white text-slate-600 cursor-pointer"
        >
          {languagesDefault.map((l) => <option key={l}>{l}</option>)}
        </select>

        <button
          onClick={() => { setEditingComp(null); setModalOpen(true); }}
          className="px-4 py-2.5 bg-blue-600 text-white rounded-md text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Novo Componente
        </button>
      </div>

      <StatsBar />

      <div className="text-[13px] text-slate-400 dark:text-slate-500 mb-3">
        {loading ? "Carregando..." : `${filtered.length} componente${filtered.length !== 1 ? "s" : ""} encontrado${filtered.length !== 1 ? "s" : ""}`}
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-4">
        {filtered.map((comp) => (
          <ComponentCard key={comp.id} comp={comp} onClick={setSelectedComp} />
        ))}
      </div>

      {modalOpen && (
        <ComponentModal
          comp={editingComp}
          onConfirm={handleSave}
          onClose={() => { setModalOpen(false); setEditingComp(null); }}
          loading={saving}
        />
      )}
    </>
  );
}
