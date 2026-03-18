// src/components/PriorizacaoPage.jsx

import { useState } from "react";
import PrioritySummary from "./priorizacao/PrioritySummary";
import EisenhowerMatrix from "./priorizacao/EisenhowerMatrix";
import ValueEffortChart from "./priorizacao/ValueEffortChart";
import PriorityRanking from "./priorizacao/PriorityRanking";
import DependencyMap from "./priorizacao/DependencyMap";

const views = [
  { key: "eisenhower", label: "Matriz de Eisenhower" },
  { key: "valueEffort", label: "Value vs. Effort" },
  { key: "ranking", label: "Ranking" },
  { key: "dependencias", label: "Dependências" },
];

export default function PriorizacaoPage() {
  const [activeView, setActiveView] = useState("eisenhower");

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-[#1B2A4A]">Priorização</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Classifique e priorize tarefas com diferentes métodos
          </p>
        </div>
      </div>

      {/* Summary cards */}
      <PrioritySummary />

      {/* View tabs */}
      <div className="flex gap-0 mb-6 border-b-2 border-slate-200">
        {views.map((view) => (
          <button
            key={view.key}
            onClick={() => setActiveView(view.key)}
            className={`px-5 py-2.5 text-sm transition-all -mb-[2px] ${
              activeView === view.key
                ? "text-blue-600 font-semibold border-b-2 border-blue-600"
                : "text-slate-400 font-normal border-b-2 border-transparent hover:text-slate-600"
            }`}
          >
            {view.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeView === "eisenhower" && <EisenhowerMatrix />}
      {activeView === "valueEffort" && <ValueEffortChart />}
      {activeView === "ranking" && <PriorityRanking />}
      {activeView === "dependencias" && <DependencyMap />}
    </>
  );
}
