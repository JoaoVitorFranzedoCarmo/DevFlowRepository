// src/components/Sidebar.jsx
import { useAuth } from "../context/AuthContext";
import {
  DashboardIcon,
  DocsIcon,
  ComponentesIcon,
  KanbanIcon,
  PriorizacaoIcon,
  ConfigIcon,
  BibliotecaIcon,
  LicoesIcon,
  ChevronIcon,
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
  {
    key: "componentes",
    label: "Componentes",
    icon: ComponentesIcon,
    expandable: true,
    children: [
      { key: "biblioteca", label: "Biblioteca de Componentes", icon: BibliotecaIcon },
      { key: "licoes", label: "Lições Aprendidas", icon: LicoesIcon },
    ],
  },
  { key: "kanban", label: "Kanban", icon: KanbanIcon },
  { key: "priorizacao", label: "Priorização", icon: PriorizacaoIcon },
];

export default function Sidebar({
  sidebarItem,
  setSidebarItem,
  subItem,
  setSubItem,
  compExpanded,
  setCompExpanded,
}) {
  const { user, logout } = useAuth();

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  function handleClick(item) {
    if (item.expandable) {
      if (sidebarItem === "componentes") {
        setCompExpanded(!compExpanded);
      } else {
        setSidebarItem(item.key);
        setCompExpanded(true);
      }
    } else {
      setSidebarItem(item.key);
      setCompExpanded(false);
    }
  }

  function handleSubClick(key) {
    setSubItem(key);
    setSidebarItem("componentes");
  }

  const isActive = (key) => sidebarItem === key;

  return (
    <div className="w-60 bg-[#1B2A4A] flex flex-col shrink-0 h-full">
      {/* Logo */}
      <div className="px-5 pt-6 pb-5 border-b border-white/[0.08]">
        <div className="text-white text-[22px] font-bold tracking-widest">DEVFLOW</div>
        <div className="text-white/40 text-[11px] mt-0.5">Gestão de Equipes</div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.key);

          return (
            <div key={item.key}>
              <div
                onClick={() => handleClick(item)}
                className={`flex items-center gap-2.5 px-5 py-2.5 cursor-pointer text-[13px] transition-all border-l-[3px] ${
                  active
                    ? "bg-white/[0.08] text-white font-medium border-blue-500"
                    : "text-white/55 border-transparent hover:bg-white/[0.04] hover:text-white/70"
                }`}
              >
                <Icon />
                <span className="flex-1">{item.label}</span>
                {item.expandable && (
                  <ChevronIcon open={compExpanded && sidebarItem === "componentes"} />
                )}
              </div>

              {/* Sub-items */}
              {item.expandable && compExpanded && sidebarItem === "componentes" && (
                <div>
                  {item.children.map((child) => {
                    const ChildIcon = child.icon;
                    const subActive = subItem === child.key;

                    return (
                      <div
                        key={child.key}
                        onClick={() => handleSubClick(child.key)}
                        className={`flex items-center gap-2.5 pl-12 pr-5 py-2 cursor-pointer text-xs transition-all border-l-[3px] ${
                          subActive
                            ? "bg-white/[0.06] text-white font-medium border-blue-500"
                            : "text-white/40 border-transparent hover:bg-white/[0.04] hover:text-white/60"
                        }`}
                      >
                        <ChildIcon />
                        {child.label}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* Separator */}
        <div className="h-px bg-white/[0.08] mx-5 my-2" />

        {/* Configurações */}
        <div
          onClick={() => { setSidebarItem("config"); setCompExpanded(false); }}
          className={`flex items-center gap-2.5 px-5 py-2.5 cursor-pointer text-[13px] transition-all border-l-[3px] ${
            isActive("config")
              ? "bg-white/[0.08] text-white font-medium border-blue-500"
              : "text-white/55 border-transparent hover:bg-white/[0.04] hover:text-white/70"
          }`}
        >
          <ConfigIcon />
          <span>Configurações</span>
        </div>
      </nav>

      {/* User + Logout */}
      <div className="px-5 py-4 border-t border-white/[0.08]">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-semibold shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <div className="text-white text-[13px] font-medium truncate">{user?.name || "Usuário"}</div>
            <div className="text-white/35 text-[11px]">{roleLabel[user?.role] || user?.role}</div>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full text-left text-white/40 text-[11px] hover:text-white/70 transition-colors flex items-center gap-1.5 mt-1"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
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
