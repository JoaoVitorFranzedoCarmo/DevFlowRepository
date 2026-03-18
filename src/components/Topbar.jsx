// src/components/Topbar.jsx

export default function Topbar({ sidebarItem, subItem }) {
  function getBreadcrumb() {
    if (sidebarItem === "componentes") {
      return subItem === "biblioteca"
        ? "Biblioteca de Componentes"
        : "Lições Aprendidas";
    }
    const labels = {
      dashboard: "Dashboard",
      docs: "Documentação",
      kanban: "Kanban",
      priorizacao: "Priorização",
      config: "Configurações",
    };
    return labels[sidebarItem] || "";
  }

  return (
    <div className="bg-white px-8 h-14 flex items-center justify-between border-b border-slate-200 shrink-0">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-slate-400">DevFlow</span>
        <span className="text-slate-300">/</span>
        {sidebarItem === "componentes" && (
          <>
            <span className="text-slate-400">Componentes</span>
            <span className="text-slate-300">/</span>
          </>
        )}
        <span className="text-[#1B2A4A] font-semibold">{getBreadcrumb()}</span>
      </div>

      {sidebarItem === "componentes" && (
        <button className="px-4 py-1.5 bg-blue-600 text-white rounded-md text-[13px] font-semibold hover:bg-blue-700 transition-colors">
          + Novo Componente
        </button>
      )}
    </div>
  );
}
