// src/components/componentes/ComponentModal.jsx
import { useState, useEffect, useRef, useId } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const CATEGORIES = ["Autenticação", "CRUD", "UI Components", "Integração API", "Formulários", "Dashboard", "Outros"];
const LANGUAGES = ["React", "Node.js", "JavaScript", "TypeScript", "Python", "Java", "C#", "Go"];

const LANG_MAP = {
  "React": "jsx", "Node.js": "javascript", "JavaScript": "javascript",
  "TypeScript": "typescript", "Python": "python", "Java": "java", "C#": "csharp", "Go": "go",
};

export default function ComponentModal({ comp, onConfirm, onClose, loading }) {
  const editing = !!comp;
  const titleId = useId();
  const firstRef = useRef(null);

  const [name, setName]         = useState(comp?.name ?? "");
  const [desc, setDesc]         = useState(comp?.desc ?? "");
  const [category, setCategory] = useState(comp?.category ?? CATEGORIES[0]);
  const [lang, setLang]         = useState(comp?.lang ?? LANGUAGES[0]);
  const [tagsRaw, setTagsRaw]   = useState(comp?.tags?.join(", ") ?? "");
  const [codeSnippet, setCodeSnippet] = useState(comp?.codeSnippet ?? "");
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => { firstRef.current?.focus(); }, []);
  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!codeSnippet.trim()) {
      alert("O trecho de código é obrigatório.");
      return;
    }
    const tags = tagsRaw.split(",").map((t) => t.trim()).filter(Boolean);
    onConfirm({ name, desc, category, lang, tags, codeSnippet });
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between sticky top-0 bg-white dark:bg-slate-800 z-10">
          <h2 id={titleId} className="text-sm font-semibold text-[#1B2A4A] dark:text-slate-100">
            {editing ? "Editar Componente" : "Novo Componente"}
          </h2>
          <button onClick={onClose} aria-label="Fechar" className="text-slate-400 hover:text-slate-600 p-0.5">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div>
            <label className="text-[12px] font-medium text-[#1B2A4A] dark:text-slate-200 mb-1.5 block">Nome *</label>
            <input
              ref={firstRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={2}
              className="w-full py-2 px-3 border border-slate-200 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-[12px] font-medium text-[#1B2A4A] dark:text-slate-200 mb-1.5 block">Descrição *</label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              required
              rows={2}
              className="w-full py-2 px-3 border border-slate-200 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[12px] font-medium text-[#1B2A4A] dark:text-slate-200 mb-1.5 block">Categoria *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full py-2 px-3 border border-slate-200 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[12px] font-medium text-[#1B2A4A] dark:text-slate-200 mb-1.5 block">Linguagem *</label>
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="w-full py-2 px-3 border border-slate-200 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                {LANGUAGES.map((l) => <option key={l}>{l}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-[12px] font-medium text-[#1B2A4A] dark:text-slate-200 mb-1.5 block">
              Tags <span className="text-slate-400 font-normal">(separadas por vírgula)</span>
            </label>
            <input
              type="text"
              value={tagsRaw}
              onChange={(e) => setTagsRaw(e.target.value)}
              placeholder="ex: auth, jwt, middleware"
              className="w-full py-2 px-3 border border-slate-200 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[12px] font-medium text-[#1B2A4A] dark:text-slate-200">
                Trecho de Código *
              </label>
              <button
                type="button"
                onClick={() => setShowPreview((v) => !v)}
                className="text-[11px] text-blue-600 hover:underline"
              >
                {showPreview ? "Editar" : "Prévia com Destaque"}
              </button>
            </div>
            {showPreview ? (
              <div className="rounded-md overflow-hidden max-h-[320px] overflow-y-auto">
                <SyntaxHighlighter
                  language={LANG_MAP[lang] || "javascript"}
                  style={oneDark}
                  showLineNumbers
                  customStyle={{ margin: 0, padding: "1rem", fontSize: "12px" }}
                >
                  {codeSnippet || "// Cole seu código para ver a prévia"}
                </SyntaxHighlighter>
              </div>
            ) : (
              <textarea
                value={codeSnippet}
                onChange={(e) => setCodeSnippet(e.target.value)}
                rows={10}
                required
                placeholder="Cole aqui o trecho de código..."
                className="w-full py-2 px-3 border border-slate-200 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 rounded-md text-xs font-mono outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-y"
              />
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-blue-600 text-white rounded-md text-sm font-semibold hover:bg-blue-700 disabled:opacity-60 flex items-center gap-2"
            >
              {loading ? "Salvando..." : editing ? "Salvar Alterações" : "Criar Componente"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
