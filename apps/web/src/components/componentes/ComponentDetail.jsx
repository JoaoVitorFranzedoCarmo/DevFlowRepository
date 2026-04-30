// src/components/componentes/ComponentDetail.jsx
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import StarRating from "./StarRating";

const LANG_MAP = {
  "React": "jsx",
  "Node.js": "javascript",
  "JavaScript": "javascript",
  "TypeScript": "typescript",
  "Python": "python",
  "Java": "java",
  "C#": "csharp",
  "Go": "go",
};

export default function ComponentDetail({ comp, onBack, onEdit, onDelete }) {
  const authorName = comp.author?.name || comp.author || "—";
  const createdAt = comp.createdAt
    ? new Date(comp.createdAt).toLocaleDateString("pt-BR")
    : comp.date || "—";
  const code = comp.codeSnippet || "// Sem trecho de código";
  const lang = LANG_MAP[comp.lang] || "javascript";

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="bg-[#1B2A4A] px-6 py-5 flex justify-between items-center">
        <div>
          <div className="text-white text-lg font-bold">{comp.name}</div>
          <div className="text-white/60 text-[13px] mt-1">
            {comp.category} · {comp.lang}
          </div>
        </div>
        <div className="flex gap-2">
          {onEdit && (
            <button
              onClick={onEdit}
              className="bg-white/15 text-white px-3.5 py-1.5 rounded-md text-[13px] hover:bg-white/25 transition-colors"
            >
              Editar
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="bg-red-500/80 text-white px-3.5 py-1.5 rounded-md text-[13px] hover:bg-red-500 transition-colors"
            >
              Excluir
            </button>
          )}
          <button
            onClick={onBack}
            className="bg-white/15 text-white px-3.5 py-1.5 rounded-md text-[13px] hover:bg-white/25 transition-colors"
          >
            Voltar
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
          <div>
            <h3 className="text-[15px] font-semibold text-[#1B2A4A] dark:text-slate-100 mb-2">Descrição</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-5">{comp.desc}</p>

            <h3 className="text-[15px] font-semibold text-[#1B2A4A] dark:text-slate-100 mb-2">Tags</h3>
            <div className="flex gap-1.5 flex-wrap mb-5">
              {(comp.tags || []).map((t) => (
                <span
                  key={t}
                  className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 px-2.5 py-1 rounded text-xs font-medium"
                >
                  {t}
                </span>
              ))}
            </div>

            <h3 className="text-[15px] font-semibold text-[#1B2A4A] dark:text-slate-100 mb-2">
              Trecho de Código
            </h3>
            <div className="rounded-lg overflow-hidden text-xs">
              <SyntaxHighlighter
                language={lang}
                style={oneDark}
                showLineNumbers
                customStyle={{ margin: 0, padding: "1rem", borderRadius: "0.5rem", fontSize: "12px" }}
              >
                {code}
              </SyntaxHighlighter>
            </div>
          </div>

          <div>
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-5 border border-slate-200 dark:border-slate-700">
              <div className="text-[13px] text-slate-400 dark:text-slate-400 mb-3">Informações</div>
              {[
                ["Autor", authorName],
                ["Criado em", createdAt],
                ["Linguagem", comp.lang],
                ["Reutilizações", (comp.uses ?? 0) + "x"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700"
                >
                  <span className="text-[13px] text-slate-400 dark:text-slate-400">{label}</span>
                  <span className="text-[13px] text-[#1B2A4A] dark:text-slate-100 font-medium">{value}</span>
                </div>
              ))}
              <div className="flex justify-between py-2">
                <span className="text-[13px] text-slate-400 dark:text-slate-400">Avaliação</span>
                <StarRating rating={comp.rating ?? 0} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
