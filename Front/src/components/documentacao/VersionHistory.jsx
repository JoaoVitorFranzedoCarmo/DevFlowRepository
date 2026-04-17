// src/components/documentacao/VersionHistory.jsx

import { versionHistory } from "../../data/documentacaoData";

export default function VersionHistory() {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-[#1B2A4A]">Histórico de Versões</h3>
        <p className="text-[11px] text-slate-400 mt-0.5">Documentos versionados automaticamente a cada commit</p>
      </div>

      <div className="flex flex-col">
        {versionHistory.map((v, i) => {
          const initials = v.author.split(" ").map((n) => n[0]).join("");
          const isLast = i === versionHistory.length - 1;

          return (
            <div key={i} className="flex gap-4">
              {/* Timeline */}
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-blue-600 border-2 border-blue-200 shrink-0 mt-1" />
                {!isLast && <div className="w-px flex-1 bg-slate-200" />}
              </div>

              {/* Content */}
              <div className={`flex-1 pb-5 ${isLast ? "" : ""}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[12px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      {v.version}
                    </span>
                    <span className="text-[11px] text-slate-400">{v.date}</span>
                  </div>
                  <span className="font-mono text-[11px] text-slate-400 bg-slate-50 px-2 py-0.5 rounded">
                    {v.commit}
                  </span>
                </div>

                <div className="text-[13px] font-medium text-[#1B2A4A] mt-1.5">{v.doc}</div>
                <div className="text-[12px] text-slate-500 mt-0.5">{v.changes}</div>

                <div className="flex items-center gap-1.5 mt-2">
                  <div className="w-4 h-4 rounded-full bg-[#1B2A4A] text-white flex items-center justify-center text-[7px] font-semibold">
                    {initials}
                  </div>
                  <span className="text-[10px] text-slate-400">{v.author}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
