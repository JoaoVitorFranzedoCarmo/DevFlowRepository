// src/components/config/TeamSettings.jsx

import { teamMembers, rolePermissions } from "../../data/configData";

export default function TeamSettings() {
  return (
    <div className="flex flex-col gap-5">
      {/* Team members */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-[#1B2A4A]">Membros da Equipe</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Gerencie os membros e seus papéis</p>
          </div>
          <button className="px-3.5 py-1.5 bg-blue-600 text-white rounded-md text-[12px] font-semibold hover:bg-blue-700 transition-colors">
            + Convidar Membro
          </button>
        </div>

        <div className="flex flex-col">
          {/* Header */}
          <div className="grid grid-cols-[1fr_200px_160px_100px] gap-3 px-3 py-2 text-[11px] text-slate-400 font-medium border-b border-slate-100">
            <span>Membro</span>
            <span>E-mail</span>
            <span>Papel</span>
            <span className="text-center">Status</span>
          </div>

          {teamMembers.map((m) => (
            <div key={m.email} className="grid grid-cols-[1fr_200px_160px_100px] gap-3 px-3 py-3 items-center text-[12px] border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#1B2A4A] text-white flex items-center justify-center text-[11px] font-semibold">
                  {m.avatar}
                </div>
                <span className="font-medium text-[#1B2A4A]">{m.name}</span>
              </div>
              <span className="text-slate-500">{m.email}</span>
              <select defaultValue={m.role} className="py-1 px-2 border border-slate-200 rounded text-[11px] bg-white text-slate-600 cursor-pointer">
                <option>Gerente de Projeto</option>
                <option>Líder Técnico</option>
                <option>Desenvolvedor</option>
                <option>QA / Analista</option>
              </select>
              <div className="text-center">
                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[10px] font-medium">
                  {m.status === "ativo" ? "Ativo" : "Inativo"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RBAC Permissions */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-sm font-semibold text-[#1B2A4A] mb-1">Permissões por Papel (RBAC)</h3>
        <p className="text-[11px] text-slate-400 mb-4">Controle de acesso baseado em papéis</p>

        <div className="overflow-x-auto">
          <div className="grid grid-cols-[140px_repeat(6,1fr)] gap-0 text-[11px]">
            {/* Header */}
            {["Papel", "Dashboard", "Kanban", "Priorização", "Documentação", "Componentes", "Configurações"].map((h, i) => (
              <div key={h} className={`px-3 py-2.5 font-medium border-b border-slate-200 ${i === 0 ? "text-[#1B2A4A]" : "text-slate-400 text-center"} bg-slate-50`}>
                {h}
              </div>
            ))}

            {/* Rows */}
            {rolePermissions.map((rp) => (
              [rp.role, rp.dashboard, rp.kanban, rp.priorizacao, rp.docs, rp.componentes, rp.config].map((val, i) => (
                <div key={`${rp.role}-${i}`} className={`px-3 py-2.5 border-b border-slate-50 ${i === 0 ? "font-medium text-[#1B2A4A]" : "text-center"}`}>
                  {i === 0 ? val : (
                    val ? (
                      <svg className="inline" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
                    ) : (
                      <svg className="inline" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    )
                  )}
                </div>
              ))
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
