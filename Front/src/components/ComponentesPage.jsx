// src/components/ComponentesPage.jsx

import { useState } from "react";
import BibliotecaTab from "./componentes/BibliotecaTab";
import LicoesTab from "./componentes/LicoesTab";
import SugestoesTab from "./componentes/SugestoesTab";

const tabs = [
  { key: "biblioteca", label: "Biblioteca de Componentes" },
  { key: "licoes", label: "Lições Aprendidas" },
  { key: "sugestoes", label: "Sugestões Inteligentes" },
];

export default function ComponentesPage({ activeTab, setActiveTab, setSubItem }) {
  return (
    <>
      {/* Tabs */}
      <div className="flex gap-0 mb-6 border-b-2 border-slate-200">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key);
              if (tab.key !== "sugestoes") setSubItem(tab.key);
            }}
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

      {/* Tab content */}
      {activeTab === "biblioteca" && <BibliotecaTab />}
      {activeTab === "licoes" && <LicoesTab />}
      {activeTab === "sugestoes" && <SugestoesTab />}
    </>
  );
}
