// src/App.jsx

import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import DashboardPage from "./components/DashboardPage";
import ComponentesPage from "./components/ComponentesPage";
import KanbanPage from "./components/KanbanPage";
import PriorizacaoPage from "./components/PriorizacaoPage";
import DocumentacaoPage from "./components/DocumentacaoPage";
import ConfigPage from "./components/ConfigPage";

export default function App() {
  const [sidebarItem, setSidebarItem] = useState("componentes");
  const [subItem, setSubItem] = useState("biblioteca");
  const [compExpanded, setCompExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState("biblioteca");

  function handleSubItemChange(key) {
    setSubItem(key);
    if (key === "biblioteca") setActiveTab("biblioteca");
    if (key === "licoes") setActiveTab("licoes");
  }

  return (
    <div className="flex h-screen font-['Inter',Arial,sans-serif] bg-slate-100 overflow-hidden">
      <Sidebar
        sidebarItem={sidebarItem}
        setSidebarItem={setSidebarItem}
        subItem={subItem}
        setSubItem={handleSubItemChange}
        compExpanded={compExpanded}
        setCompExpanded={setCompExpanded}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar sidebarItem={sidebarItem} subItem={subItem} />

        <div className="flex-1 overflow-auto p-8">
          {sidebarItem === "dashboard" && <DashboardPage />}
          {sidebarItem === "componentes" && (
            <ComponentesPage
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              setSubItem={setSubItem}
            />
          )}
          {sidebarItem === "kanban" && <KanbanPage />}
          {sidebarItem === "priorizacao" && <PriorizacaoPage />}
          {sidebarItem === "docs" && <DocumentacaoPage />}
          {sidebarItem === "config" && <ConfigPage />}
        </div>
      </div>
    </div>
  );
}
