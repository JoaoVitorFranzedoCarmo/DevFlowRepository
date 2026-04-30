// src/components/Sidebar.jsx
import { useAuth } from "../context/AuthContext";
import {
  DashboardIcon,
  DocsIcon,
  KanbanIcon,
  PriorizacaoIcon,
  ConfigIcon,
  BibliotecaIcon,
  LicoesIcon,
} from "../icons/SidebarIcons";

const roleLabel = {
  GERENTE: "Gerente de Projeto",
  LIDER: "Líder Técnico",
  DESENVOLVEDOR: "Desenvolvedor",
  QA: "QA / Analista",
};

const menuItems = [
  { key: "dashboard", label: "Dashboard", icon: DashboardIcon },
  { key: "docs", label: "Documentação", icon: DocsIcon },
  { key: "licoes", label: "Lições Aprendidas", icon: LicoesIcon },
  { key: "biblioteca", label: "Biblioteca de Componentes", icon: BibliotecaIcon },
  { key: "kanban", label: "Kanban", icon: KanbanIcon },
  { key: "priorizacao", label: "Priorização", icon: PriorizacaoIcon },
];

function keyActivate(fn) {
  return (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      fn();
    }
  };
}

export default function Sidebar({ sidebarItem, setSidebarItem }) {
  const { user, logout } = useAuth();

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  const isActive = (key) => sidebarItem === key;

  return (
    <div className="w-64 bg-[#0F172A] border-r border-white/[0.06] flex flex-col h-full">

      {/* Logo */}
      <div className="px-6 pt-6 pb-5 border-b border-white/[0.06]">
        <div className="text-white text-[20px] font-semibold tracking-wide">
          Dev<span className="text-blue-400">Flow</span>
        </div>
        <div className="text-white/40 text-[11px] mt-1">
          Gestão de Equipes
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.key);

          return (
            <div
              key={item.key}
              role="button"
              tabIndex={0}
              onClick={() => setSidebarItem(item.key)}
              onKeyDown={keyActivate(() => setSidebarItem(item.key))}
              className={`group flex items-center gap-3 px-6 py-2.5 cursor-pointer text-[13px] transition-all duration-200 ease-out border-l-[3px] ${
                active
                  ? "bg-blue-500/10 text-blue-400 border-blue-500"
                  : "text-white/50 border-transparent hover:bg-white/[0.04] hover:text-white hover:scale-[1.02]"
              }`}
            >
              <Icon
                className={`${
                  active ? "opacity-100" : "opacity-60 group-hover:opacity-100"
                }`}
              />
              <span className="flex-1">{item.label}</span>
            </div>
          );
        })}

        {/* Separator */}
        <div className="h-px bg-white/[0.06] mx-6 my-3" />

        {/* Config */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => setSidebarItem("config")}
          onKeyDown={keyActivate(() => setSidebarItem("config"))}
          className={`group flex items-center gap-3 px-6 py-2.5 cursor-pointer text-[13px] transition-all duration-200 border-l-[3px] ${
            isActive("config")
              ? "bg-blue-500/10 text-blue-400 border-blue-500"
              : "text-white/50 border-transparent hover:bg-white/[0.04] hover:text-white"
          }`}
        >
          <ConfigIcon />
          <span>Configurações</span>
        </div>
      </nav>

      {/* User */}
      <div className="px-6 py-4 border-t border-white/[0.06]">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-semibold shadow-md">
            {initials}
          </div>

          <div className="min-w-0">
            <div className="text-white text-[13px] font-medium truncate">
              {user?.name || "Usuário"}
            </div>
            <div className="text-white/35 text-[11px]">
              {roleLabel[user?.role] || user?.role}
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full text-left text-white/40 text-xs hover:text-red-400 transition-colors flex items-center gap-2"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Sair
        </button>
      </div>
    </div>
  );
}
