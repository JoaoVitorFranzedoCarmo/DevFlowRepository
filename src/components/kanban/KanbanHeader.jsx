// src/components/kanban/KanbanHeader.jsx

import { SearchIcon } from "../../icons/SidebarIcons";

export default function KanbanHeader({
  search,
  setSearch,
  filterPriority,
  setFilterPriority,
  filterAssignee,
  setFilterAssignee,
}) {
  return (
    <div className="mb-6">
      {/* Title row */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-[#1B2A4A]">Kanban</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Sprint 12 · Gerencie suas tarefas arrastando entre as colunas
          </p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-[13px] font-semibold hover:bg-blue-700 transition-colors flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Nova Tarefa
        </button>
      </div>

      {/* Filters row */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <input
            type="text"
            placeholder="Buscar tarefas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full py-2 pl-9 pr-3.5 border border-slate-200 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2">
            <SearchIcon />
          </span>
        </div>

        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="px-3 py-2 border border-slate-200 rounded-md text-[13px] bg-white text-slate-600 cursor-pointer"
        >
          <option value="todas">Todas as prioridades</option>
          <option value="critica">Crítica</option>
          <option value="alta">Alta</option>
          <option value="media">Média</option>
          <option value="baixa">Baixa</option>
        </select>

        <select
          value={filterAssignee}
          onChange={(e) => setFilterAssignee(e.target.value)}
          className="px-3 py-2 border border-slate-200 rounded-md text-[13px] bg-white text-slate-600 cursor-pointer"
        >
          <option value="todos">Todos os membros</option>
          <option value="João Vitor">João Vitor</option>
          <option value="Leander">Leander</option>
        </select>
      </div>
    </div>
  );
}
