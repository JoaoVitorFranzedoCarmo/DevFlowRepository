// src/components/LicoesTab.jsx

import { lessons } from "../data/mockData";

export default function LicoesTab() {
  return (
    <>
      {/* Search bar */}
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Pesquisar lições aprendidas..."
          className="flex-1 py-2.5 px-3.5 border border-slate-200 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
        />
        <button className="px-4 py-2.5 bg-blue-600 text-white rounded-md text-[13px] font-semibold hover:bg-blue-700 transition-colors">
          + Nova Lição
        </button>
      </div>

      {/* Lessons list */}
      <div className="flex flex-col gap-3">
        {lessons.map((l) => {
          const initials = l.author
            .split(" ")
            .map((n) => n[0])
            .join("");

          return (
            <div
              key={l.id}
              className="bg-white rounded-lg border border-slate-200 p-5 border-l-4 border-l-amber-400"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="text-base font-semibold text-[#1B2A4A]">{l.title}</div>
                <span className="bg-amber-50 text-amber-800 px-2.5 py-0.5 rounded text-[11px] font-medium shrink-0 ml-3">
                  {l.project}
                </span>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed mb-3">{l.desc}</p>

              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-[#1B2A4A] text-white flex items-center justify-center text-[8px] font-semibold">
                  {initials}
                </div>
                <span className="text-xs text-slate-400">{l.author}</span>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
