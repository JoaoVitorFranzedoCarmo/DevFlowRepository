// src/components/documentacao/VersionHistory.jsx
import { useState, useEffect, useCallback } from "react";
import api from "../../services/api";

export default function VersionHistory() {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [restoringId, setRestoringId] = useState(null);

  const fetchVersions = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/documents/versions");
      setVersions(data);
    } catch (err) {
      console.error("Erro ao carregar versões:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchVersions(); }, [fetchVersions]);

  async function handleRestore(v) {
    if (!window.confirm(`Restaurar documento "${v.document?.title}" para versão ${v.version}?`)) return;
    setRestoringId(v.id);
    try {
      await api.post(`/documents/${v.documentId}/versions/${v.id}/restore`);
      await fetchVersions();
      window.alert("Versão restaurada com sucesso.");
    } catch (err) {
      console.error("Erro ao restaurar:", err);
      window.alert(err?.response?.data?.message || "Erro ao restaurar versão.");
    } finally {
      setRestoringId(null);
    }
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-[#1B2A4A] dark:text-slate-100">Histórico de Versões</h3>
        <p className="text-[11px] text-slate-400 mt-0.5">
          Documentos versionados automaticamente a cada geração e commit
        </p>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-400 text-sm">Carregando histórico...</div>
      ) : versions.length === 0 ? (
        <div className="py-12 text-center text-slate-400 text-sm">Nenhuma versão registrada ainda.</div>
      ) : (
        <div className="flex flex-col">
          {versions.map((v, i) => {
            const authorName = v.author || "Sistema";
            const initials = authorName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
            const isLast = i === versions.length - 1;
            const dateStr = v.createdAt ? new Date(v.createdAt).toLocaleString("pt-BR") : "";

            return (
              <div key={v.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-600 border-2 border-blue-200 shrink-0 mt-1" />
                  {!isLast && <div className="w-px flex-1 bg-slate-200 dark:bg-slate-700" />}
                </div>

                <div className="flex-1 pb-5">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[12px] font-semibold text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded">
                        {v.version}
                      </span>
                      <span className="text-[11px] text-slate-400">{dateStr}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {v.commit && (
                        <span className="font-mono text-[11px] text-slate-400 bg-slate-50 dark:bg-slate-700 px-2 py-0.5 rounded">
                          {v.commit}
                        </span>
                      )}
                      <button
                        onClick={() => handleRestore(v)}
                        disabled={restoringId === v.id}
                        className="px-2.5 py-1 text-[11px] font-semibold rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 transition-colors"
                      >
                        {restoringId === v.id ? "Restaurando..." : "Restaurar"}
                      </button>
                    </div>
                  </div>

                  <div className="text-[13px] font-medium text-[#1B2A4A] dark:text-slate-100 mt-1.5">
                    {v.document?.title || "Documento removido"}
                  </div>
                  <div className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5">{v.changes}</div>

                  <div className="flex items-center gap-1.5 mt-2">
                    <div className="w-4 h-4 rounded-full bg-[#1B2A4A] text-white flex items-center justify-center text-[7px] font-semibold">
                      {initials}
                    </div>
                    <span className="text-[10px] text-slate-400">{authorName}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
