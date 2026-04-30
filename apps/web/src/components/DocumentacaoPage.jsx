// src/components/DocumentacaoPage.jsx

import { useState } from "react";
import DocSummary from "./documentacao/DocSummary";
import DocList from "./documentacao/DocList";
import AutoGenPanel from "./documentacao/AutoGenPanel";
import TemplateGrid from "./documentacao/TemplateGrid";
import VersionHistory from "./documentacao/VersionHistory";

const tabs = [
  { key: "documentos", label: "Documentos Gerados" },
  { key: "gerar", label: "Geração Automática" },
  { key: "templates", label: "Templates" },
  { key: "versoes", label: "Histórico de Versões" },
];

export default function DocumentacaoPage() {
  const [activeTab, setActiveTab] = useState("documentos");

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-[#1B2A4A]">Documentação</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Gere, versione e gerencie documentação técnica automaticamente
          </p>
        </div>
      </div>

      {/* Summary cards */}
      <DocSummary />

      {/* Tabs */}
      <div className="flex gap-0 mb-6 border-b-2 border-slate-200">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-2.5 text-sm transition-all -mb-[2px] ${
              activeTab === tab.key
                ? "text-blue-600 font-semibold border-b-2 border-blue-600"
                : "text-slate-400 font-normal border-b-2 border-transparent hover:text-slate-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === "documentos" && <DocList />}
      {activeTab === "gerar" && <AutoGenPanel />}
      {activeTab === "templates" && <TemplateGrid />}
      {activeTab === "versoes" && <VersionHistory />}
    </>
  );
}
