// src/components/Topbar.jsx

const pageLabels = {
  dashboard: "Dashboard",
  docs: "Documentação",
  kanban: "Kanban",
  priorizacao: "Priorização",
  config: "Configurações",
};

export default function Topbar({ sidebarItem, subItem }) {
  const isComponentes = sidebarItem === "componentes";
  const currentLabel = isComponentes
    ? (subItem === "biblioteca" ? "Biblioteca de Componentes" : "Lições Aprendidas")
    : (pageLabels[sidebarItem] || "");

  return (
    <header className="bg-white px-8 h-14 flex items-center justify-between border-b border-slate-200 shrink-0">
      <nav aria-label="Localização atual">
        <ol className="flex items-center gap-2 text-sm" role="list">
          <li>
            <span className="text-slate-400">DevFlow</span>
          </li>

          {isComponentes && (
            <li className="flex items-center gap-2">
              <span className="text-slate-300" aria-hidden="true">/</span>
              <span className="text-slate-400">Componentes</span>
            </li>
          )}

          <li className="flex items-center gap-2">
            <span className="text-slate-300" aria-hidden="true">/</span>
            <span className="text-[#1B2A4A] font-semibold" aria-current="page">{currentLabel}</span>
          </li>
        </ol>
      </nav>

      {isComponentes && (
        <button
          aria-label="Criar novo componente"
          className="px-4 py-1.5 bg-blue-600 text-white rounded-md text-[13px] font-semibold hover:bg-blue-700 active:bg-blue-800 transition-colors"
        >
          + Novo Componente
        </button>
      )}
    </header>
  );
}
