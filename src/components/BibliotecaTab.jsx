// src/components/BibliotecaTab.jsx

import { useState } from "react";
import { components, categories, languages } from "../data/mockData";
import { SearchIcon } from "../icons/SidebarIcons";
import StatsBar from "./StatsBar";
import ComponentCard from "./ComponentCard";
import ComponentDetail from "./ComponentDetail";

export default function BibliotecaTab() {
  const [search, setSearch] = useState("");
  const [selCat, setSelCat] = useState("Todos");
  const [selLang, setSelLang] = useState("Todas");
  const [selectedComp, setSelectedComp] = useState(null);

  const filtered = components.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.desc.toLowerCase().includes(search.toLowerCase());
    const matchCat = selCat === "Todos" || c.category === selCat;
    const matchLang = selLang === "Todas" || c.lang === selLang;
    return matchSearch && matchCat && matchLang;
  });

  if (selectedComp) {
    return (
      <ComponentDetail comp={selectedComp} onBack={() => setSelectedComp(null)} />
    );
  }

  return (
    <>
      {/* Search & Filters */}
      <div className="flex gap-3 mb-5 flex-wrap">
        <div className="flex-1 min-w-[250px] relative">
          <input
            type="text"
            placeholder="Pesquisar componentes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full py-2.5 pl-9 pr-3.5 border border-slate-200 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2">
            <SearchIcon />
          </span>
        </div>

        <select
          value={selCat}
          onChange={(e) => setSelCat(e.target.value)}
          className="px-3.5 py-2.5 border border-slate-200 rounded-md text-[13px] bg-white text-slate-600 cursor-pointer"
        >
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <select
          value={selLang}
          onChange={(e) => setSelLang(e.target.value)}
          className="px-3.5 py-2.5 border border-slate-200 rounded-md text-[13px] bg-white text-slate-600 cursor-pointer"
        >
          {languages.map((l) => (
            <option key={l}>{l}</option>
          ))}
        </select>
      </div>

      {/* Stats */}
      <StatsBar />

      {/* Results count */}
      <div className="text-[13px] text-slate-400 mb-3">
        {filtered.length} componente{filtered.length !== 1 ? "s" : ""} encontrado
        {filtered.length !== 1 ? "s" : ""}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-4">
        {filtered.map((comp) => (
          <ComponentCard key={comp.id} comp={comp} onClick={setSelectedComp} />
        ))}
      </div>
    </>
  );
}
