// src/components/documentacao/TemplateGrid.jsx

import { templates } from "../../data/documentacaoData";

const iconMap = {
  code: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
  ),
  api: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="1.8" strokeLinecap="round"><path d="M18 20V10" /><path d="M12 20V4" /><path d="M6 20v-6" /></svg>
  ),
  book: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="1.8" strokeLinecap="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" /></svg>
  ),
  arch: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><line x1="10" y1="6.5" x2="14" y2="6.5" /><line x1="6.5" y1="10" x2="6.5" y2="14" /></svg>
  ),
  meeting: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="1.8" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>
  ),
  release: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="1.8" strokeLinecap="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" /></svg>
  ),
};

export default function TemplateGrid() {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-[#1B2A4A]">Templates de Documentação</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Templates customizáveis para diferentes tipos de documento</p>
        </div>
        <button className="px-3.5 py-1.5 border border-blue-600 text-blue-600 rounded-md text-[12px] font-medium hover:bg-blue-50 transition-colors">
          + Criar Template
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {templates.map((tp) => (
          <div key={tp.id} className="border border-slate-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer group">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                {iconMap[tp.icon]}
              </div>
              <span className="text-[10px] text-slate-400">{tp.uses}x usado</span>
            </div>
            <div className="text-[13px] font-semibold text-[#1B2A4A] mb-1">{tp.name}</div>
            <div className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">{tp.desc}</div>
            <button className="mt-3 w-full py-1.5 text-[11px] font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors opacity-0 group-hover:opacity-100">
              Usar Template
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
