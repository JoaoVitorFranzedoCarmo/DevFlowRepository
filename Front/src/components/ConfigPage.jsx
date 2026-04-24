// src/components/ConfigPage.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import ProfileSettings from "./config/ProfileSettings";
import TeamSettings from "./config/TeamSettings";
import RolePermissions from "./config/RolePermissions";

const baseTabs = [
  { key: "perfil", label: "Perfil" },
  { key: "equipe", label: "Equipe e Permissões" },
];

export default function ConfigPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("perfil");

  const tabs = user?.role === "GERENTE"
    ? [...baseTabs, { key: "cargos", label: "Cargos e Permissões" }]
    : baseTabs;

  return (
    <>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-[#1B2A4A]">Configurações</h1>
        <p className="text-sm text-slate-400 mt-0.5">
          Gerencie seu perfil e equipe
        </p>
      </div>

      <div className="flex gap-0 mb-6 border-b-2 border-slate-200 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-2.5 text-sm transition-all -mb-[2px] ${
              activeTab === tab.key
                ? "text-blue-600 font-semibold border-b-2 border-blue-600"
                : "text-slate-400 font-normal border-b-2 border-transparent hover:text-slate-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "perfil" && <ProfileSettings />}
      {activeTab === "equipe" && <TeamSettings />}
      {activeTab === "cargos" && <RolePermissions />}
    </>
  );
}
