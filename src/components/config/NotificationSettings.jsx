// src/components/config/NotificationSettings.jsx

import { useState } from "react";
import { notificationSettings as initialSettings } from "../../data/configData";

function Toggle({ enabled, onToggle }) {
  return (
    <div
      onClick={onToggle}
      className={`w-8 h-5 rounded-full relative cursor-pointer transition-colors ${enabled ? "bg-blue-600" : "bg-slate-200"}`}
    >
      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${enabled ? "left-3.5" : "left-0.5"}`} />
    </div>
  );
}

export default function NotificationSettings() {
  const [settings, setSettings] = useState(initialSettings);
  const [saved, setSaved] = useState(false);

  function toggleSetting(index, channel) {
    setSettings((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [channel]: !s[channel] } : s))
    );
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-[#1B2A4A]">Notificações</h3>
        <p className="text-[11px] text-slate-400 mt-0.5">Escolha como e quando deseja ser notificado</p>
      </div>

      {/* Header */}
      <div className="grid grid-cols-[1fr_80px_80px] gap-3 px-3 py-2 text-[11px] text-slate-400 font-medium border-b border-slate-100">
        <span>Evento</span>
        <span className="text-center">E-mail</span>
        <span className="text-center">Push</span>
      </div>

      {/* Rows */}
      {settings.map((s, i) => (
        <div key={s.key} className="grid grid-cols-[1fr_80px_80px] gap-3 px-3 py-3 items-center border-b border-slate-50 last:border-0">
          <span className="text-[13px] text-[#1B2A4A]">{s.label}</span>
          <div className="flex justify-center">
            <Toggle enabled={s.email} onToggle={() => toggleSetting(i, "email")} />
          </div>
          <div className="flex justify-center">
            <Toggle enabled={s.push} onToggle={() => toggleSetting(i, "push")} />
          </div>
        </div>
      ))}

      <div className="flex items-center gap-3 mt-5">
        <button
          onClick={handleSave}
          className="px-5 py-2 bg-blue-600 text-white rounded-md text-[13px] font-semibold hover:bg-blue-700 transition-colors"
        >
          Salvar Preferências
        </button>
        {saved && (
          <span className="text-[12px] text-green-600 font-medium flex items-center gap-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
            Salvo
          </span>
        )}
      </div>
    </div>
  );
}
