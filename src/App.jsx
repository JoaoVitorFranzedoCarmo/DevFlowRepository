// src/App.jsx
import { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import DashboardPage from "./components/DashboardPage";
import ComponentesPage from "./components/ComponentesPage";
import KanbanPage from "./components/KanbanPage";
import PriorizacaoPage from "./components/PriorizacaoPage";
import DocumentacaoPage from "./components/DocumentacaoPage";
import ConfigPage from "./components/ConfigPage";

function AppInner() {
  const { user, loading } = useAuth();
  const [authView, setAuthView] = useState("login"); // "login" | "register"
  const [sidebarItem, setSidebarItem] = useState("dashboard");
  const [subItem, setSubItem] = useState("biblioteca");
  const [compExpanded, setCompExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState("biblioteca");

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-slate-400 text-sm">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return authView === "login"
      ? <LoginPage onGoRegister={() => setAuthView("register")} />
      : <RegisterPage onGoLogin={() => setAuthView("login")} />;
  }

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

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}
