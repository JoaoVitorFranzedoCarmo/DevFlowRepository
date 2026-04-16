// src/App.jsx
import { useState, lazy, Suspense } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

const DashboardPage    = lazy(() => import("./components/DashboardPage"));
const ComponentesPage  = lazy(() => import("./components/ComponentesPage"));
const KanbanPage       = lazy(() => import("./components/KanbanPage"));
const PriorizacaoPage  = lazy(() => import("./components/PriorizacaoPage"));
const DocumentacaoPage = lazy(() => import("./components/DocumentacaoPage"));
const ConfigPage       = lazy(() => import("./components/ConfigPage"));

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
          <Suspense fallback={<div className="flex items-center justify-center py-20 text-slate-400 text-sm">Carregando...</div>}>
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
          </Suspense>
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
