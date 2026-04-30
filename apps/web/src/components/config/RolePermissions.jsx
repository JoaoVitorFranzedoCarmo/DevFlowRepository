// src/components/config/RolePermissions.jsx
import { useState, useEffect, useCallback } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const ACTION_LABEL = {
  visualizar: "Visualizar",
  criar: "Criar",
  editar: "Editar",
  deletar: "Deletar",
};

const MODULE_LABEL = {
  dashboard: "Dashboard",
  kanban: "Kanban",
  priorizacao: "Priorização",
  documentacao: "Documentação",
  componentes: "Componentes",
  configuracoes: "Configurações",
};

export default function RolePermissions() {
  const { user } = useAuth();
  const [matrix, setMatrix] = useState(null);
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDesc, setNewRoleDesc] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [m, r] = await Promise.all([
        api.get("/rbac/matrix"),
        api.get("/rbac/roles"),
      ]);
      setMatrix(m.data);
      setRoles(r.data);
      if (!selectedRole && r.data.length) setSelectedRole(r.data[0].name);
    } catch (err) {
      console.error("Erro ao carregar RBAC:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedRole]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  if (user?.role !== "GERENTE") {
    return (
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-12 text-center">
        <div className="text-4xl mb-3">🔒</div>
        <h3 className="text-sm font-semibold text-[#1B2A4A] dark:text-slate-100">Acesso restrito</h3>
        <p className="text-xs text-slate-400 mt-1">Apenas Gerentes de Projeto podem gerenciar cargos e permissões.</p>
      </div>
    );
  }

  if (loading || !matrix) {
    return <div className="py-12 text-center text-slate-400 text-sm">Carregando permissões...</div>;
  }

  const modules = matrix.modules || [];
  const actions = matrix.actions || [];
  const rolePerms = matrix.matrix[selectedRole] || {};

  async function handleToggle(module, action, current) {
    if (selectedRole === "ADMINISTRADOR") {
      setMessage("Permissões de Administrador não podem ser alteradas");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    setSaving(true);
    try {
      await api.put("/rbac/permission", {
        roleName: selectedRole,
        module,
        action,
        allowed: !current,
      });
      setMatrix((m) => ({
        ...m,
        matrix: {
          ...m.matrix,
          [selectedRole]: {
            ...m.matrix[selectedRole],
            [module]: {
              ...(m.matrix[selectedRole]?.[module] || {}),
              [action]: !current,
            },
          },
        },
      }));
    } catch (err) {
      console.error("Erro ao salvar permissão:", err);
      setMessage("Erro ao salvar permissão");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setSaving(false);
    }
  }

  async function handleCreateRole(e) {
    e.preventDefault();
    if (!newRoleName.trim()) return;
    try {
      await api.post("/rbac/roles", { name: newRoleName.trim(), description: newRoleDesc.trim() });
      setNewRoleName("");
      setNewRoleDesc("");
      await fetchAll();
      setSelectedRole(newRoleName.trim());
    } catch (err) {
      console.error("Erro ao criar cargo:", err);
      setMessage(err?.response?.data?.message || "Erro ao criar cargo");
      setTimeout(() => setMessage(""), 3000);
    }
  }

  async function handleDeleteRole(role) {
    if (!window.confirm(`Excluir o cargo "${role.name}"?`)) return;
    try {
      await api.delete(`/rbac/roles/${role.id}`);
      await fetchAll();
    } catch (err) {
      console.error("Erro ao excluir cargo:", err);
      setMessage(err?.response?.data?.message || "Erro ao excluir cargo");
      setTimeout(() => setMessage(""), 3000);
    }
  }

  const currentRole = roles.find((r) => r.name === selectedRole);

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-semibold text-[#1B2A4A] dark:text-slate-100">Cargos</h3>
            <p className="text-[11px] text-slate-400">Gerencie os cargos e permissões de acesso</p>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap mb-4">
          {roles.map((r) => (
            <button
              key={r.id}
              onClick={() => setSelectedRole(r.name)}
              className={`px-3 py-1.5 rounded-md text-[12px] font-medium flex items-center gap-2 transition-colors ${
                selectedRole === r.name
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-200 hover:bg-slate-200"
              }`}
            >
              <span>{r.name}</span>
              {r.isSystem && <span className="text-[9px] opacity-70">(sistema)</span>}
            </button>
          ))}
        </div>

        <form onSubmit={handleCreateRole} className="flex items-end gap-2 flex-wrap border-t border-slate-100 dark:border-slate-700 pt-3">
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Nome do cargo</label>
            <input
              type="text"
              value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value.toUpperCase())}
              placeholder="EX: DESIGNER"
              className="py-1.5 px-2.5 border border-slate-200 dark:border-slate-600 rounded-md text-[12px] bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 font-mono"
            />
          </div>
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Descrição</label>
            <input
              type="text"
              value={newRoleDesc}
              onChange={(e) => setNewRoleDesc(e.target.value)}
              placeholder="Ex: Designer UX/UI"
              className="py-1.5 px-2.5 border border-slate-200 dark:border-slate-600 rounded-md text-[12px] bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200"
            />
          </div>
          <button
            type="submit"
            className="py-1.5 px-3.5 bg-blue-600 text-white rounded-md text-[12px] font-semibold hover:bg-blue-700"
          >
            + Novo Cargo
          </button>
          {currentRole && !currentRole.isSystem && (
            <button
              type="button"
              onClick={() => handleDeleteRole(currentRole)}
              className="py-1.5 px-3.5 bg-red-600 text-white rounded-md text-[12px] font-semibold hover:bg-red-700"
            >
              Excluir "{currentRole.name}"
            </button>
          )}
        </form>

        {message && (
          <div className="mt-3 px-3 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-[12px] text-red-600 dark:text-red-300">
            {message}
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-[#1B2A4A] dark:text-slate-100">
              Matriz de Permissões — {selectedRole}
            </h3>
            <p className="text-[11px] text-slate-400">
              Clique para alternar cada permissão. As mudanças são salvas automaticamente.
            </p>
          </div>
          {saving && <span className="text-[11px] text-blue-600">Salvando...</span>}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-2 px-3 font-semibold text-[#1B2A4A] dark:text-slate-200">Módulo</th>
                {actions.map((a) => (
                  <th key={a} className="text-center py-2 px-3 font-semibold text-[#1B2A4A] dark:text-slate-200 w-28">
                    {ACTION_LABEL[a] || a}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {modules.map((m) => (
                <tr key={m} className="border-b border-slate-50 dark:border-slate-700/50">
                  <td className="py-3 px-3 font-medium text-slate-700 dark:text-slate-200">
                    {MODULE_LABEL[m] || m}
                  </td>
                  {actions.map((a) => {
                    const allowed = rolePerms[m]?.[a] || false;
                    return (
                      <td key={a} className="text-center py-3 px-3">
                        <button
                          onClick={() => handleToggle(m, a, allowed)}
                          disabled={saving}
                          aria-pressed={allowed}
                          className={`w-10 h-6 rounded-full relative transition-colors ${
                            allowed ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-600"
                          }`}
                        >
                          <span
                            className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all ${
                              allowed ? "left-[18px]" : "left-0.5"
                            }`}
                          />
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
