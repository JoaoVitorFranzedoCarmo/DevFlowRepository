// src/components/config/AppearanceSettings.jsx

import { useState } from "react";

export default function AppearanceSettings() {
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("pt-BR");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [density, setDensity] = useState("normal");

  const themes = [
    { key: "light", label: "Claro", bg: "bg-white", border: "border-slate-200", preview: "bg-slate-100" },
    { key: "dark", label: "Escuro", bg: "bg-slate-800", border: "border-slate-600", preview: "bg-slate-900" },
    { key: "auto", label: "Automático", bg: "bg-gradient-to-r from-white to-slate-800", border: "border-slate-300", preview: "bg-slate-200" },
  ];

  return (
    <div className="flex flex-col gap-5">
      {/* Theme */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-sm font-semibold text-[#1B2A4A] mb-1">Tema</h3>
        <p className="text-[11px] text-slate-400 mb-4">Escolha a aparência da interface</p>

        <div className="flex gap-4">
          {themes.map((t) => (
            <div
              key={t.key}
              onClick={() => setTheme(t.key)}
              className={`flex-1 cursor-pointer rounded-lg border-2 p-3 transition-all ${
                theme === t.key ? "border-blue-600 ring-2 ring-blue-100" : "border-slate-200 hover:border-slate-300"
              }`}
            >
              {/* Preview */}
              <div className={`h-16 rounded-md mb-2 ${t.preview} flex items-center justify-center overflow-hidden`}>
                <div className="flex gap-1 w-full px-2">
                  <div className={`w-8 h-10 rounded ${t.key === "dark" ? "bg-slate-700" : "bg-[#1B2A4A]"}`} />
                  <div className="flex-1 flex flex-col gap-1 p-1">
                    <div className={`h-2 w-3/4 rounded ${t.key === "dark" ? "bg-slate-600" : "bg-slate-200"}`} />
                    <div className={`h-2 w-1/2 rounded ${t.key === "dark" ? "bg-slate-600" : "bg-slate-200"}`} />
                    <div className={`h-3 w-full rounded ${t.key === "dark" ? "bg-slate-700" : "bg-white"}`} />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  theme === t.key ? "border-blue-600" : "border-slate-300"
                }`}>
                  {theme === t.key && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                </div>
                <span className="text-[12px] font-medium text-[#1B2A4A]">{t.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* General preferences */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-sm font-semibold text-[#1B2A4A] mb-1">Preferências Gerais</h3>
        <p className="text-[11px] text-slate-400 mb-4">Ajuste comportamentos da interface</p>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[12px] font-medium text-[#1B2A4A] mb-1.5 block">Idioma</label>
            <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full py-2 px-3 border border-slate-200 rounded-md text-[13px] bg-white text-slate-600 cursor-pointer">
              <option value="pt-BR">Português (Brasil)</option>
              <option value="en">English</option>
              <option value="es">Español</option>
            </select>
          </div>

          <div>
            <label className="text-[12px] font-medium text-[#1B2A4A] mb-1.5 block">Densidade da Interface</label>
            <select value={density} onChange={(e) => setDensity(e.target.value)} className="w-full py-2 px-3 border border-slate-200 rounded-md text-[13px] bg-white text-slate-600 cursor-pointer">
              <option value="compact">Compacta</option>
              <option value="normal">Normal</option>
              <option value="comfortable">Confortável</option>
            </select>
          </div>

          <div className="col-span-2">
            <div
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="flex items-center justify-between p-3 rounded-md border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors"
            >
              <div>
                <span className="text-[12px] font-medium text-[#1B2A4A]">Sidebar compacta por padrão</span>
                <p className="text-[11px] text-slate-400">Mostra apenas ícones na sidebar ao iniciar</p>
              </div>
              <div className={`w-8 h-5 rounded-full relative transition-colors ${sidebarCollapsed ? "bg-blue-600" : "bg-slate-200"}`}>
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${sidebarCollapsed ? "left-3.5" : "left-0.5"}`} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-white rounded-lg border border-red-200 p-6">
        <h3 className="text-sm font-semibold text-red-600 mb-1">Zona de Perigo</h3>
        <p className="text-[11px] text-slate-400 mb-4">Ações irreversíveis — cuidado</p>

        <div className="flex items-center justify-between p-3 rounded-md border border-red-100 bg-red-50/50">
          <div>
            <span className="text-[12px] font-medium text-[#1B2A4A]">Excluir todos os dados do projeto</span>
            <p className="text-[11px] text-slate-400">Remove tarefas, documentos, componentes e configurações permanentemente</p>
          </div>
          <button className="px-3.5 py-1.5 bg-white border border-red-300 text-red-600 rounded-md text-[11px] font-semibold hover:bg-red-50 transition-colors">
            Excluir Projeto
          </button>
        </div>
      </div>
    </div>
  );
}
