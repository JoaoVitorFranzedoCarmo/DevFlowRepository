// src/components/SugestoesTab.jsx

import { suggestions } from "../data/mockData";
import { LicoesIcon } from "../icons/SidebarIcons";

const matchColors = [
  { bg: "bg-green-100", text: "text-green-600" },
  { bg: "bg-amber-100", text: "text-amber-600" },
  { bg: "bg-blue-100", text: "text-blue-600" },
];

export default function SugestoesTab() {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
          <LicoesIcon />
        </div>
        <div>
          <div className="text-[15px] font-semibold text-[#1B2A4A]">
            Sugestões para seu projeto atual
          </div>
          <div className="text-[13px] text-slate-400">Baseado no projeto: DevFlow v1.0</div>
        </div>
      </div>

      {/* Suggestions list */}
      <div className="flex flex-col gap-3">
        {suggestions.map((s, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200"
          >
            <div
              className={`w-12 h-12 rounded-lg ${matchColors[i].bg} flex items-center justify-center shrink-0`}
            >
              <span className={`text-sm font-bold ${matchColors[i].text}`}>
                {s.match}
              </span>
            </div>

            <div className="flex-1">
              <div className="text-sm font-semibold text-[#1B2A4A] mb-1">{s.comp}</div>
              <div className="text-[13px] text-slate-400 leading-snug">{s.reason}</div>
            </div>

            <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-xs font-semibold shrink-0 hover:bg-blue-700 transition-colors">
              Importar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
