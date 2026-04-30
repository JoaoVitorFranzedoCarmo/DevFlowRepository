// src/components/config/TeamSettings.jsx
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import { rolePermissions } from "../../data/configData";

const roleOptions = [
  { value: "GERENTE",      label: "Gerente de Projeto" },
  { value: "LIDER",        label: "Líder Técnico" },
  { value: "DESENVOLVEDOR",label: "Desenvolvedor" },
  { value: "QA",           label: "QA / Analista" },
];

const roleLabel = {
  GERENTE: "Gerente de Projeto",
  LIDER: "Líder Técnico",
  DESENVOLVEDOR: "Desenvolvedor",
  QA: "QA / Analista",
};

export default function TeamSettings() {
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const isGerente = user?.role === "GERENTE";

  const fetchMembers = useCallback(async () => {
    try {
      const { data } = await api.get("/users");
      setMembers(data);
    } catch (err) {
      console.error("Erro ao carregar usuários:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMembers(); }, [fetchMembers]);

  async function handleRoleChange(memberId, newRole) {
    try {
      await api.put(`/users/${memberId}`, { role: newRole });
      setMembers((prev) => prev.map((m) => m.id === memberId ? { ...m, role: newRole } : m));
    } catch (err) {
      console.error("Erro ao atualizar papel:", err);
    }
  }

  async function handleDelete(memberId) {
    if (!window.confirm("Excluir este usuário permanentemente?")) return;
    try {
      await api.delete(`/users/${memberId}`);
      setMembers((prev) => prev.filter((m) => m.id !== memberId));
    } catch (err) {
      alert(err.response?.data?.error || "Erro ao excluir usuário.");
    }
  }

  const initials = (name) => name ? name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "?";

  return (
    <div className="flex flex-col gap-5">
      {/* Team members */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-[#1B2A4A]">Membros da Equipe</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Gerencie os membros e seus papéis</p>
          </div>
        </div>

        {loading ? (
          <div className="py-8 text-center text-slate-400 text-sm">Carregando membros...</div>
        ) : (
          <div className="flex flex-col">
            <div className="grid grid-cols-[1fr_200px_180px_80px_60px] gap-3 px-3 py-2 text-[11px] text-slate-400 font-medium border-b border-slate-100">
              <span>Membro</span>
              <span>E-mail</span>
              <span>Papel</span>
              <span className="text-center">Role</span>
              {isGerente && <span className="text-center">Ações</span>}
            </div>

            {members.map((m) => (
              <div key={m.id} className="grid grid-cols-[1fr_200px_180px_80px_60px] gap-3 px-3 py-3 items-center text-[12px] border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#1B2A4A] text-white flex items-center justify-center text-[11px] font-semibold">
                    {initials(m.name)}
                  </div>
                  <div>
                    <span className="font-medium text-[#1B2A4A]">{m.name}</span>
                    {m.id === user?.id && <span className="ml-2 text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded font-medium">Você</span>}
                  </div>
                </div>
                <span className="text-slate-500 truncate">{m.email}</span>
                <select
                  value={m.role}
                  onChange={(e) => handleRoleChange(m.id, e.target.value)}
                  disabled={!isGerente || m.id === user?.id}
                  className="py-1 px-2 border border-slate-200 rounded text-[11px] bg-white text-slate-600 cursor-pointer disabled:opacity-60 disabled:cursor-default"
                >
                  {roleOptions.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
                <div className="text-center">
                  <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[10px] font-medium">Ativo</span>
                </div>
                {isGerente && (
                  <div className="text-center">
                    {m.id !== user?.id && (
                      <button
                        onClick={() => handleDelete(m.id)}
                        className="p-1 rounded hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                        title="Excluir usuário"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                          <path d="M10 11v6" /><path d="M14 11v6" />
                        </svg>
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RBAC Permissions */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-sm font-semibold text-[#1B2A4A] mb-1">Permissões por Papel (RBAC)</h3>
        <p className="text-[11px] text-slate-400 mb-4">Controle de acesso baseado em papéis</p>
        <div className="overflow-x-auto">
          <div className="grid grid-cols-[140px_repeat(6,1fr)] gap-0 text-[11px]">
            {["Papel", "Dashboard", "Kanban", "Priorização", "Documentação", "Componentes", "Configurações"].map((h, i) => (
              <div key={h} className={`px-3 py-2.5 font-medium border-b border-slate-200 ${i === 0 ? "text-[#1B2A4A]" : "text-slate-400 text-center"} bg-slate-50`}>{h}</div>
            ))}
            {rolePermissions.map((rp) => (
              [rp.role, rp.dashboard, rp.kanban, rp.priorizacao, rp.docs, rp.componentes, rp.config].map((val, i) => (
                <div key={`${rp.role}-${i}`} className={`px-3 py-2.5 border-b border-slate-50 ${i === 0 ? "font-medium text-[#1B2A4A]" : "text-center"}`}>
                  {i === 0 ? val : (
                    val
                      ? <svg className="inline" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
                      : <svg className="inline" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
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
