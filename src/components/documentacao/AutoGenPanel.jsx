// src/components/documentacao/AutoGenPanel.jsx

import { useState } from "react";
import { scanConfig } from "../../data/documentacaoData";

export default function AutoGenPanel() {
  const [languages, setLanguages] = useState(scanConfig.languages);
  const [selectedFormat, setSelectedFormat] = useState("HTML");
  const [repoUrl, setRepoUrl] = useState("https://github.com/devflow/devflow-app");
  const [branch, setBranch] = useState("main");
  const [isScanning, setIsScanning] = useState(false);

  function toggleLang(index) {
    setLanguages((prev) =>
      prev.map((l, i) => (i === index ? { ...l, enabled: !l.enabled } : l))
    );
  }

  function handleGenerate() {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 3000);
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-5">
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-[#1B2A4A]">Geração Automática</h3>
        <p className="text-[11px] text-slate-400 mt-0.5">
          Escaneia o código-fonte e gera documentação a partir dos comentários
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Left: Config */}
        <div className="flex flex-col gap-5">
          {/* Repository */}
          <div>
            <label className="text-[12px] font-medium text-[#1B2A4A] mb-1.5 block">Repositório</label>
            <input
              type="text"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              className="w-full py-2 px-3 border border-slate-200 rounded-md text-[13px] outline-none focus:border-blue-500 bg-white font-mono"
            />
          </div>

          {/* Branch */}
          <div>
            <label className="text-[12px] font-medium text-[#1B2A4A] mb-1.5 block">Branch</label>
            <select value={branch} onChange={(e) => setBranch(e.target.value)} className="w-full py-2 px-3 border border-slate-200 rounded-md text-[13px] bg-white text-slate-600 cursor-pointer">
              <option value="main">main</option>
              <option value="develop">develop</option>
              <option value="staging">staging</option>
            </select>
          </div>

          {/* Output format */}
          <div>
            <label className="text-[12px] font-medium text-[#1B2A4A] mb-1.5 block">Formato de Saída</label>
            <div className="flex gap-2">
              {scanConfig.formats.map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setSelectedFormat(fmt)}
                  className={`px-3.5 py-1.5 rounded-md text-[12px] font-medium transition-colors ${
                    selectedFormat === fmt
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div>
            <label className="text-[12px] font-medium text-[#1B2A4A] mb-1.5 block">Linguagens do Scan</label>
            <div className="flex flex-col gap-2">
              {languages.map((lang, i) => (
                <div
                  key={lang.name}
                  onClick={() => toggleLang(i)}
                  className="flex items-center justify-between p-2.5 rounded-md border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-5 rounded-full relative transition-colors ${lang.enabled ? "bg-blue-600" : "bg-slate-200"}`}>
                      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${lang.enabled ? "left-3.5" : "left-0.5"}`} />
                    </div>
                    <span className="text-[12px] font-medium text-[#1B2A4A]">{lang.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">{lang.ext}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Integrations + Action */}
        <div className="flex flex-col gap-5">
          {/* Integrations */}
          <div>
            <label className="text-[12px] font-medium text-[#1B2A4A] mb-1.5 block">Integrações</label>
            <div className="flex flex-col gap-2">
              {scanConfig.integrations.map((integ) => (
                <div key={integ.name} className="flex items-center justify-between p-2.5 rounded-md border border-slate-200">
                  <span className="text-[12px] font-medium text-[#1B2A4A]">{integ.name}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                    integ.status === "conectado"
                      ? "bg-green-100 text-green-700"
                      : "bg-slate-100 text-slate-500"
                  }`}>
                    {integ.status === "conectado" ? "Conectado" : "Desconectado"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Preview of what will be scanned */}
          <div className="bg-slate-800 rounded-lg p-4 flex-1">
            <div className="text-[11px] text-slate-400 mb-2 font-medium">Preview do Scan</div>
            <div className="font-mono text-[11px] leading-6 text-slate-300">
              <div><span className="text-purple-400">$</span> devflow scan --repo {repoUrl.split("/").pop()}</div>
              <div><span className="text-purple-400">$</span> --branch {branch}</div>
              <div><span className="text-purple-400">$</span> --langs {languages.filter((l) => l.enabled).map((l) => l.name.toLowerCase()).join(",")}</div>
              <div><span className="text-purple-400">$</span> --format {selectedFormat.toLowerCase()}</div>
              <div><span className="text-purple-400">$</span> --output ./docs/generated/</div>
              {isScanning && (
                <>
                  <div className="mt-2 text-green-400">Escaneando código-fonte...</div>
                  <div className="text-green-400">Extraindo comentários ({languages.filter((l) => l.enabled).map((l) => l.ext).join(", ")})...</div>
                  <div className="text-green-400">Gerando documentação em {selectedFormat}...</div>
                </>
              )}
            </div>
          </div>

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={isScanning}
            className={`w-full py-3 rounded-md text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${
              isScanning
                ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {isScanning ? (
              <>
                <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M21 12a9 9 0 11-6.219-8.56" />
                </svg>
                Gerando documentação...
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <polyline points="16 18 22 12 16 6" />
                  <polyline points="8 6 2 12 8 18" />
                </svg>
                Escanear e Gerar Documentação
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
