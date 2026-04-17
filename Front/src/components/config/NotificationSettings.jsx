// src/components/config/NotificationSettings.jsx
import { useState, useEffect, useCallback } from "react";
import api from "../../services/api";

const DEFAULT_SETTINGS = [
  { eventKey: "task_assigned",  label: "Tarefa atribuída a mim",   email: true,  push: true },
  { eventKey: "task_due",       label: "Tarefa próxima do prazo",   email: true,  push: false },
  { eventKey: "sprint_start",   label: "Início de sprint",          email: false, push: true },
  { eventKey: "sprint_end",     label: "Fim de sprint",             email: true,  push: true },
  { eventKey: "doc_updated",    label: "Documentação atualizada",   email: false, push: false },
  { eventKey: "component_new",  label: "Novo componente adicionado",email: false, push: true },
];

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
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchSettings = useCallback(async () => {
    try {
      const { data } = await api.get("/notifications");
      if (data.length > 0) {
        // Mescla dados da API com labels padrão
        setSettings(DEFAULT_SETTINGS.map((def) => {
          const fromApi = data.find((d) => d.eventKey === def.eventKey);
          return fromApi ? { ...def, email: fromApi.email, push: fromApi.push } : def;
        }));
      }
    } catch (err) {
      console.error("Erro ao carregar notificações:", err);
    }
  }, []);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  function toggleSetting(index, channel) {
    setSettings((prev) => prev.map((s, i) => (i === index ? { ...s, [channel]: !s[channel] } : s)));
  }

  async function handleSave() {
    setError("");
    setLoading(true);
    try {
      await api.put("/notifications/bulk", {
        settings: settings.map(({ eventKey, email, push }) => ({ eventKey, email, push })),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Erro ao salvar preferências.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-[#1B2A4A]">Notificações</h3>
        <p className="text-[11px] text-slate-400 mt-0.5">Escolha como e quando deseja ser notificado</p>
      </div>

      <div className="grid grid-cols-[1fr_80px_80px] gap-3 px-3 py-2 text-[11px] text-slate-400 font-medium border-b border-slate-100">
        <span>Evento</span>
        <span className="text-center">E-mail</span>
        <span className="text-center">Push</span>
      </div>

      {settings.map((s, i) => (
        <div key={s.eventKey} className="grid grid-cols-[1fr_80px_80px] gap-3 px-3 py-3 items-center border-b border-slate-50 last:border-0">
          <span className="text-[13px] text-[#1B2A4A]">{s.label}</span>
          <div className="flex justify-center">
            <Toggle enabled={s.email} onToggle={() => toggleSetting(i, "email")} />
          </div>
          <div className="flex justify-center">
            <Toggle enabled={s.push} onToggle={() => toggleSetting(i, "push")} />
          </div>
        </div>
      ))}

      {error && (
        <div className="mt-3 bg-red-50 border border-red-200 rounded-md px-3 py-2 text-sm text-red-600">{error}</div>
      )}

      <div className="flex items-center gap-3 mt-5">
        <button
          onClick={handleSave}
          disabled={loading}
          className="px-5 py-2 bg-blue-600 text-white rounded-md text-[13px] font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60"
        >
          {loading ? "Salvando..." : "Salvar Preferências"}
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
