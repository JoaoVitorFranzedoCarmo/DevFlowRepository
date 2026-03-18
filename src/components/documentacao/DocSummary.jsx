// src/components/documentacao/DocSummary.jsx

import { generatedDocs, templates } from "../../data/documentacaoData";

export default function DocSummary() {
  const total = generatedDocs.length;
  const updated = generatedDocs.filter((d) => d.status === "atualizado").length;
  const outdated = generatedDocs.filter((d) => d.status === "desatualizado").length;
  const totalPages = generatedDocs.reduce((a, d) => a + d.pages, 0);

  const cards = [
    { label: "Documentos Gerados", value: total, color: "text-[#1B2A4A]", accent: "bg-[#1B2A4A]" },
    { label: "Atualizados", value: updated, color: "text-green-600", accent: "bg-green-600" },
    { label: "Desatualizados", value: outdated, color: "text-red-600", accent: "bg-red-600" },
    { label: "Templates Disponíveis", value: templates.length, color: "text-purple-600", accent: "bg-purple-600" },
    { label: "Total de Páginas", value: totalPages, color: "text-blue-600", accent: "bg-blue-600" },
  ];

  return (
    <div className="grid grid-cols-5 gap-4 mb-6">
      {cards.map((card, i) => (
        <div key={i} className="bg-white rounded-lg border border-slate-200 p-4 relative overflow-hidden">
          <div className={`absolute top-0 left-0 w-1 h-full ${card.accent}`} />
          <div className="text-[11px] text-slate-400 mb-1">{card.label}</div>
          <div className={`text-xl font-bold ${card.color}`}>{card.value}</div>
        </div>
      ))}
    </div>
  );
}
