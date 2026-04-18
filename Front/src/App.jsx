// src/App.jsx
import { useState, lazy, Suspense } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
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
      <div
        className="min-h-screen bg-[#1B2A4A] flex items-center justify-center"
        role="status"
        aria-label="Carregando aplicação"
      >
        <div className="text-center">
          <div className="text-white text-3xl font-bold tracking-widest mb-5">DEVFLOW</div>
          <div className="flex items-center justify-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
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
    <div className="flex h-screen font-['Inter',Arial,sans-serif] bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100 overflow-hidden">
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

        <main id="main-content" className="flex-1 overflow-auto p-8">
          <Suspense fallback={
            <div className="flex items-center justify-center py-20" role="status" aria-label="Carregando página">
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          }>
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
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppInner />
      </AuthProvider>
    </ThemeProvider>
  );
}
