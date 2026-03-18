// src/components/config/ProfileSettings.jsx

import { useState } from "react";
import { userProfile } from "../../data/configData";

export default function ProfileSettings() {
  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);
  const [role, setRole] = useState(userProfile.role);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <h3 className="text-sm font-semibold text-[#1B2A4A] mb-1">Perfil do Usuário</h3>
      <p className="text-[11px] text-slate-400 mb-5">Gerencie suas informações pessoais</p>

      <div className="flex gap-8">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-20 h-20 rounded-full bg-[#1B2A4A] text-white flex items-center justify-center text-2xl font-bold">
            {userProfile.avatar}
          </div>
          <button className="text-[12px] text-blue-600 font-medium hover:underline">
            Alterar foto
          </button>
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
              <option>Gerente de Projeto</option>
              <option>Líder Técnico</option>
              <option>Desenvolvedor</option>
              <option>QA / Analista</option>
            </select>
          </div>
          <div>
            <label className="text-[12px] font-medium text-[#1B2A4A] mb-1.5 block">Equipe</label>
            <input
              type="text"
              value="DevFlow"
              disabled
              className="w-full py-2 px-3 border border-slate-200 rounded-md text-[13px] bg-slate-50 text-slate-400"
            />
          </div>
          <div className="col-span-2 flex items-center gap-3 mt-2">
            <button
              onClick={handleSave}
              className="px-5 py-2 bg-blue-600 text-white rounded-md text-[13px] font-semibold hover:bg-blue-700 transition-colors"
            >
              Salvar Alterações
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
