// src/components/documentacao/AutoGenPanel.jsx
import { useState, useEffect } from "react";
import api from "../../services/api";

const formats = ["HTML", "PDF", "MARKDOWN"];

export default function AutoGenPanel() {
  const [docs, setDocs] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState("");
  const [sourceCode, setSourceCode] = useState("");
  const [format, setFormat] = useState("HTML");
  const [commit, setCommit] = useState("");
  const [changes, setChanges] = useState("");
  const [generating, setGenerating] = useState(false);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    api.get("/documents")
      .then(({ data }) => {
        setDocs(data);
        if (data.length && !selectedDocId) setSelectedDocId(data[0].id);
      })
      .catch((err) => console.error("Erro ao carregar documentos:", err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleGenerate() {
    if (!selectedDocId) {
      setError("Selecione um documento.");
      return;
    }
    if (!sourceCode.trim()) {
      setError("Cole o código-fonte para gerar documentação.");
      return;
    }
    setError("");
    setGenerating(true);
    try {
      const { data } = await api.post(`/documents/${selectedDocId}/generate`, {
        sourceCode,
        format,
        commit: commit || undefined,
        changes: changes || undefined,
      });
      setPreview(data.content || "");
      setShowPreview(true);
    } catch (err) {
      console.error("Erro ao gerar:", err);
      setError(err?.response?.data?.message || "Erro ao gerar documentação.");
    } finally {
      setGenerating(false);
    }
  }

  const selectedDoc = docs.find((d) => d.id === selectedDocId);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5">
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-[#1B2A4A] dark:text-slate-100">Geração Automática</h3>
        <p className="text-[11px] text-slate-400 mt-0.5">
          Cole o código-fonte e gere documentação estruturada em HTML, PDF ou Markdown
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-[12px] font-medium text-[#1B2A4A] dark:text-slate-200 mb-1.5 block">
              Documento Alvo
            </label>
            <select
              value={selectedDocId}
              onChange={(e) => setSelectedDocId(e.target.value)}
              className="w-full py-2 px-3 border border-slate-200 dark:border-slate-600 rounded-md text-[13px] bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-200 cursor-pointer"
            >
              {docs.length === 0 && <option value="">Nenhum documento disponível</option>}
              {docs.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.title} — {d.version}
                </option>
              ))}
            </select>
            {selectedDoc && (
              <div className="text-[10px] text-slate-400 mt-1">
                Tipo: {selectedDoc.type} · Formato atual: {selectedDoc.format} · Status: {selectedDoc.status}
              </div>
            )}
          </div>

          <div>
            <label className="text-[12px] font-medium text-[#1B2A4A] dark:text-slate-200 mb-1.5 block">
              Formato de Saída
            </label>
            <div className="flex gap-2">
              {formats.map((f) => (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  className={`px-3.5 py-1.5 rounded-md text-[12px] font-medium transition-colors ${
                    format === f
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 hover:bg-slate-200"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[12px] font-medium text-[#1B2A4A] dark:text-slate-200 mb-1.5 block">
                Commit (opcional)
              </label>
              <input
                type="text"
                value={commit}
                onChange={(e) => setCommit(e.target.value)}
                placeholder="abc1234"
                className="w-full py-2 px-3 border border-slate-200 dark:border-slate-600 rounded-md text-[13px] outline-none focus:border-blue-500 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-200 font-mono"
              />
            </div>
            <div>
              <label className="text-[12px] font-medium text-[#1B2A4A] dark:text-slate-200 mb-1.5 block">
                Descrição da Alteração
              </label>
              <input
                type="text"
                value={changes}
                onChange={(e) => setChanges(e.target.value)}
                placeholder="Ex: docs iniciais"
                className="w-full py-2 px-3 border border-slate-200 dark:border-slate-600 rounded-md text-[13px] outline-none focus:border-blue-500 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-200"
              />
            </div>
          </div>

          {error && (
            <div className="px-3 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-[12px] text-red-600 dark:text-red-300">
              {error}
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={generating || !selectedDocId}
            className={`w-full py-3 rounded-md text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${
              generating || !selectedDocId
                ? "bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {generating ? (
              <>
                <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M21 12a9 9 0 11-6.219-8.56" />
                </svg>
                Gerando documentação...
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <polyline points="16 18 22 12 16 6" />
                  <polyline points="8 6 2 12 8 18" />
                </svg>
                Gerar e Salvar
              </>
            )}
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[12px] font-medium text-[#1B2A4A] dark:text-slate-200">
            Código-Fonte
          </label>
          <textarea
            value={sourceCode}
            onChange={(e) => setSourceCode(e.target.value)}
            placeholder="Cole aqui o código-fonte (funções, classes, comentários, etc)"
            rows={18}
            className="w-full flex-1 p-3 border border-slate-200 dark:border-slate-600 rounded-md text-[12px] font-mono outline-none focus:border-blue-500 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 resize-none"
          />
          <div className="text-[10px] text-slate-400">
            {sourceCode.length} caracteres · {sourceCode.split("\n").length} linhas
          </div>
        </div>
      </div>

      {showPreview && preview && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowPreview(false)}
        >
          <div
            className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-5xl h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#1B2A4A] dark:text-slate-100">
                Preview — {selectedDoc?.title}
              </h3>
              <button
                onClick={() => setShowPreview(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-auto p-0">
              {format === "HTML" ? (
                <iframe title="preview" srcDoc={preview} className="w-full h-full border-0 bg-white" />
              ) : (
                <pre className="p-5 text-[12px] font-mono text-slate-700 dark:text-slate-200 whitespace-pre-wrap">
                  {preview}
                </pre>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
