// src/components/documentacao/DocSummary.jsx
import { useState, useEffect } from "react";
import api from "../../services/api";

export default function DocSummary() {
  const [stats, setStats] = useState({
    total: 0,
    updated: 0,
    outdated: 0,
    drafts: 0,
    totalPages: 0,
    templates: 0,
  });

  useEffect(() => {
    api.get("/documents/stats")
      .then(({ data }) => setStats(data))
      .catch((err) => console.error("Erro ao carregar stats:", err));
  }, []);

  const cards = [
    { label: "Documentos Gerados", value: stats.total, color: "text-[#1B2A4A] dark:text-slate-100", accent: "bg-[#1B2A4A]" },
    { label: "Atualizados", value: stats.updated, color: "text-green-600", accent: "bg-green-600" },
    { label: "Desatualizados", value: stats.outdated, color: "text-red-600", accent: "bg-red-600" },
    { label: "Rascunhos", value: stats.drafts, color: "text-slate-500", accent: "bg-slate-400" },
    { label: "Total de Páginas", value: stats.totalPages, color: "text-blue-600", accent: "bg-blue-600" },
  ];

  return (
    <div className="grid grid-cols-5 gap-4 mb-6">
      {cards.map((card, i) => (
        <div key={i} className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 relative overflow-hidden">
          <div className={`absolute top-0 left-0 w-1 h-full ${card.accent}`} />
          <div className="text-[11px] text-slate-400 mb-1">{card.label}</div>
          <div className={`text-xl font-bold ${card.color}`}>{card.value}</div>
        </div>
      ))}
    </div>
  );
}
