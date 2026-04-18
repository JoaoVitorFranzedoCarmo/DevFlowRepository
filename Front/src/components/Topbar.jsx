// src/components/Topbar.jsx
import { useTheme } from "../context/ThemeContext";
import NotificationBell from "./NotificationBell";

const pageLabels = {
  dashboard: "Dashboard",
  docs: "Documentação",
  kanban: "Kanban",
  priorizacao: "Priorização",
  config: "Configurações",
};

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}
function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export default function Topbar({ sidebarItem, subItem }) {
  const { theme, toggle } = useTheme();
  const isComponentes = sidebarItem === "componentes";
  const currentLabel = isComponentes
    ? (subItem === "biblioteca" ? "Biblioteca de Componentes" : "Lições Aprendidas")
    : (pageLabels[sidebarItem] || "");

  return (
    <header className="bg-white dark:bg-slate-800 px-8 h-14 flex items-center justify-between border-b border-slate-200 dark:border-slate-700 shrink-0">
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
            <span className="text-[#1B2A4A] dark:text-slate-100 font-semibold" aria-current="page">{currentLabel}</span>
          </li>
        </ol>
      </nav>

      <div className="flex items-center gap-2">
        <NotificationBell />
        <button
          onClick={toggle}
          aria-label={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
          title={theme === "dark" ? "Modo claro" : "Modo escuro"}
          className="w-9 h-9 rounded-md flex items-center justify-center text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
        >
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
        </button>
      </div>
    </header>
  );
}
