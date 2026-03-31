// src/App.jsx

import { useState } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import LoginPage from "./components/LoginPage";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import DashboardPage from "./components/DashboardPage";
import ComponentesPage from "./components/ComponentesPage";
import KanbanPage from "./components/KanbanPage";
import PriorizacaoPage from "./components/PriorizacaoPage";
import DocumentacaoPage from "./components/DocumentacaoPage";
import ConfigPage from "./components/ConfigPage";

function AppContent() {
  const { user, loading, logout } = useAuth();
  const [sidebarItem, setSidebarItem] = useState("componentes");
  const [subItem, setSubItem] = useState("biblioteca");
  const [compExpanded, setCompExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState("biblioteca");

  function handleSubItemChange(key) {
    setSubItem(key);
    if (key === "biblioteca") setActiveTab("biblioteca");
    if (key === "licoes") setActiveTab("licoes");
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#1B2A4A] flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-3xl font-bold tracking-widest mb-2">DEVFLOW</div>
          <div className="text-white/40 text-sm">Carregando...</div>
        </div>
      </div>
    );
  }

  // Not authenticated -> show login
  if (!user) {
    return <LoginPage />;
  }

  // Authenticated -> show app
  return (
    <div className="flex h-screen font-['Inter',Arial,sans-serif] bg-slate-100 overflow-hidden">
      <Sidebar
        sidebarItem={sidebarItem}
        setSidebarItem={setSidebarItem}
        subItem={subItem}
        setSubItem={handleSubItemChange}
        compExpanded={compExpanded}
        setCompExpanded={setCompExpanded}
        user={user}
        onLogout={logout}
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

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
