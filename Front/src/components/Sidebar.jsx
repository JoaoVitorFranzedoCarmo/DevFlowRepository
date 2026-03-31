// src/components/Sidebar.jsx

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

const roleLabels = {
  GERENTE: "Gerente de Projeto",
  LIDER: "Líder Técnico",
  DESENVOLVEDOR: "Desenvolvedor",
  QA: "QA / Analista",
};

export default function Sidebar({
  sidebarItem,
  setSidebarItem,
  subItem,
  setSubItem,
  compExpanded,
  setCompExpanded,
  user,
  onLogout,
}) {
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

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
    : "??";

  const displayName = user?.name?.split(" ").slice(0, 2).join(" ") || "Usuário";
  const roleLabel = roleLabels[user?.role] || user?.role || "";

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
          onClick={() => {
            setSidebarItem("config");
            setCompExpanded(false);
          }}
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

      {/* User */}
      <div className="px-5 py-4 border-t border-white/[0.08]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-semibold">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white text-[13px] font-medium truncate">{displayName}</div>
            <div className="text-white/35 text-[11px]">{roleLabel}</div>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="mt-3 w-full py-1.5 text-[11px] text-white/40 border border-white/10 rounded-md hover:bg-white/[0.06] hover:text-white/60 transition-colors"
        >
          Sair
        </button>
      </div>
    </div>
  );
}
