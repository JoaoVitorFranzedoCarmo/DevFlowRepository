// src/components/componentes/LicoesTab.jsx
import { useState, useEffect, useCallback } from "react";
import api from "../../services/api";

export default function LicoesTab() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", desc: "", project: "" });
  const [saving, setSaving] = useState(false);

  const fetchLessons = useCallback(async () => {
    try {
      const { data } = await api.get("/lessons");
      setLessons(Array.isArray(data) ? data : []);
    } catch {
      setLessons([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchLessons(); }, [fetchLessons]);

  const filtered = lessons.filter((l) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return l.title?.toLowerCase().includes(q) || l.desc?.toLowerCase().includes(q);
  });

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title || !form.desc) return;
    setSaving(true);
    try {
      await api.post("/lessons", form);
      setForm({ title: "", desc: "", project: "" });
      setShowForm(false);
      await fetchLessons();
    } catch (err) {
      console.error("Erro ao criar lição:", err);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Excluir esta lição?")) return;
    try {
      await api.delete(`/lessons/${id}`);
      await fetchLessons();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Pesquisar lições aprendidas..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 py-2.5 px-3.5 border border-slate-200 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
        />
        <button
          onClick={() => setShowForm((v) => !v)}
          className="px-4 py-2.5 bg-blue-600 text-white rounded-md text-[13px] font-semibold hover:bg-blue-700 transition-colors"
        >
          {showForm ? "Cancelar" : "+ Nova Lição"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4 mb-4 flex flex-col gap-3">
          <input
            type="text"
            placeholder="Título"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
            minLength={2}
            className="py-2 px-3 border border-slate-200 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Projeto (opcional)"
            value={form.project}
            onChange={(e) => setForm({ ...form, project: e.target.value })}
            className="py-2 px-3 border border-slate-200 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <textarea
            placeholder="Descrição da lição..."
            value={form.desc}
            onChange={(e) => setForm({ ...form, desc: e.target.value })}
            required
            rows={3}
            className="py-2 px-3 border border-slate-200 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
          />
          <button
            type="submit"
            disabled={saving}
            className="self-end px-4 py-2 bg-blue-600 text-white rounded-md text-[13px] font-semibold hover:bg-blue-700 disabled:opacity-60"
          >
            {saving ? "Salvando..." : "Salvar Lição"}
          </button>
        </form>
      )}

      <div className="flex flex-col gap-3">
        {loading && <div className="text-slate-400 text-sm">Carregando...</div>}
        {!loading && filtered.length === 0 && (
          <div className="text-slate-400 dark:text-slate-500 text-sm text-center py-8">Nenhuma lição encontrada.</div>
        )}
        {filtered.map((l) => {
          const authorName = l.author?.name || "—";
          const initials = authorName.split(" ").map((n) => n[0]).join("").slice(0, 2);
          return (
            <div
              key={l.id}
              className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5 border-l-4 border-l-amber-400"
            >
              <div className="flex justify-between items-start mb-2 gap-3">
                <div className="text-base font-semibold text-[#1B2A4A] dark:text-slate-100">{l.title}</div>
                <div className="flex items-center gap-2 shrink-0">
                  {l.project && (
                    <span className="bg-amber-50 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 px-2.5 py-0.5 rounded text-[11px] font-medium">
                      {l.project}
                    </span>
                  )}
                  <button
                    onClick={() => handleDelete(l.id)}
                    className="text-slate-300 hover:text-red-500 text-xs"
                    aria-label="Excluir lição"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-3">{l.desc}</p>
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-[#1B2A4A] dark:bg-blue-600 text-white flex items-center justify-center text-[8px] font-semibold">
                  {initials}
                </div>
                <span className="text-xs text-slate-400 dark:text-slate-400">{authorName}</span>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
