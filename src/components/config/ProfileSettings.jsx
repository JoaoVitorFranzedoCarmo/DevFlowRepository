// src/components/config/ProfileSettings.jsx
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

const roleOptions = [
  { value: "GERENTE",      label: "Gerente de Projeto" },
  { value: "LIDER",        label: "Líder Técnico" },
  { value: "DESENVOLVEDOR",label: "Desenvolvedor" },
  { value: "QA",           label: "QA / Analista" },
];

export default function ProfileSettings() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [role, setRole] = useState(user?.role || "DESENVOLVEDOR");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  async function handleSave() {
    setError("");
    setLoading(true);
    try {
      const { data } = await api.put(`/users/${user.id}`, { name, email, role });
      updateUser(data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Erro ao salvar alterações.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <h3 className="text-sm font-semibold text-[#1B2A4A] mb-1">Perfil do Usuário</h3>
      <p className="text-[11px] text-slate-400 mb-5">Gerencie suas informações pessoais</p>

      <div className="flex gap-8">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-20 h-20 rounded-full bg-[#1B2A4A] text-white flex items-center justify-center text-2xl font-bold">
            {initials}
          </div>
        </div>

        {/* Form */}
        <div className="flex-1 grid grid-cols-2 gap-4">
          <div>
            <label className="text-[12px] font-medium text-[#1B2A4A] mb-1.5 block">Nome completo</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full py-2 px-3 border border-slate-200 rounded-md text-[13px] outline-none focus:border-blue-500 bg-white"
            />
          </div>
          <div>
            <label className="text-[12px] font-medium text-[#1B2A4A] mb-1.5 block">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full py-2 px-3 border border-slate-200 rounded-md text-[13px] outline-none focus:border-blue-500 bg-white"
            />
          </div>
          <div>
            <label className="text-[12px] font-medium text-[#1B2A4A] mb-1.5 block">Cargo / Papel</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full py-2 px-3 border border-slate-200 rounded-md text-[13px] bg-white text-slate-600 cursor-pointer"
            >
              {roleOptions.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>

          {error && (
            <div className="col-span-2 bg-red-50 border border-red-200 rounded-md px-3 py-2 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="col-span-2 flex items-center gap-3 mt-2">
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-5 py-2 bg-blue-600 text-white rounded-md text-[13px] font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60"
            >
              {loading ? "Salvando..." : "Salvar Alterações"}
            </button>
            {saved && (
              <span className="text-[12px] text-green-600 font-medium flex items-center gap-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
                Salvo com sucesso
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
