// src/components/config/IntegrationSettings.jsx

import { useState } from "react";
import { integrations as initialIntegrations } from "../../data/configData";

const iconMap = {
  github: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" /></svg>,
  gitlab: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 01-.3-.94l1.22-3.78 2.44-7.51A.42.42 0 015.13 2a.43.43 0 01.42.31l2.44 7.49h8.02l2.44-7.51A.42.42 0 0118.87 2a.43.43 0 01.42.31l2.44 7.51L23 13.45a.84.84 0 01-.35.94z" /></svg>,
  jira: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M12 2L2 12l10 10 10-10L12 2z" /><path d="M12 8v8" /><path d="M8 12h8" /></svg>,
  slack: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="13" y="2" width="3" height="8" rx="1.5" /><rect x="8" y="14" width="3" height="8" rx="1.5" /><rect x="2" y="8" width="8" height="3" rx="1.5" /><rect x="14" y="13" width="8" height="3" rx="1.5" /></svg>,
  jenkins: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg>,
  sonar: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>,
};

export default function IntegrationSettings() {
  const [integs, setIntegs] = useState(initialIntegrations);

  function toggleIntegration(index) {
    setIntegs((prev) =>
      prev.map((integ, i) =>
        i === index
          ? { ...integ, status: integ.status === "conectado" ? "desconectado" : "conectado" }
          : integ
      )
    );
  }

  const connected = integs.filter((i) => i.status === "conectado").length;

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-[#1B2A4A]">Integrações</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Conecte ferramentas do ecossistema de desenvolvimento — {connected} de {integs.length} ativas
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {integs.map((integ, i) => {
          const isConnected = integ.status === "conectado";

          return (
            <div key={integ.name} className={`flex items-center gap-4 p-4 rounded-lg border transition-colors ${isConnected ? "border-green-200 bg-green-50/30" : "border-slate-200 bg-white"}`}>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${isConnected ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-400"}`}>
                {iconMap[integ.icon]}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-semibold text-[#1B2A4A]">{integ.name}</span>
                  {isConnected && (
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                  )}
                </div>
                <div className="text-[11px] text-slate-400 truncate">{integ.desc}</div>
              </div>

              <button
                onClick={() => toggleIntegration(i)}
                className={`px-3.5 py-1.5 rounded-md text-[11px] font-semibold transition-colors shrink-0 ${
                  isConnected
                    ? "bg-white border border-red-200 text-red-600 hover:bg-red-50"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {isConnected ? "Desconectar" : "Conectar"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
