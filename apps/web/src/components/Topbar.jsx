// src/components/Topbar.jsx

const pageLabels = {
  dashboard: "Dashboard",
  docs: "Documentação",
  kanban: "Kanban",
  priorizacao: "Priorização",
  config: "Configurações",
  biblioteca: "Biblioteca de Componentes",
  licoes: "Lições Aprendidas",
};

export default function Topbar({ sidebarItem }) {
  const label = pageLabels[sidebarItem] || "";

  return (
    <header className="bg-white px-8 h-14 flex items-center border-b border-slate-200 shrink-0">
      <nav aria-label="Localização atual">
        <ol className="flex items-center gap-2 text-sm" role="list">
          <li>
            <span className="text-slate-400">DevFlow</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-slate-300" aria-hidden="true">/</span>
            <span className="text-[#1B2A4A] font-semibold" aria-current="page">{label}</span>
          </li>
        </ol>
      </nav>
    </header>
  );
}
