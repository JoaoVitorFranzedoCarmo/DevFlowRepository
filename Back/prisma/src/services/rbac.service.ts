import { NotFoundError, ConflictError, ForbiddenError } from "../utils/errors";
import {
  RolePermissionRepository,
  CustomRoleRepository,
  rolePermissionRepository,
  customRoleRepository,
} from "../repositories/role-permission.repository";

export const MODULES = ["dashboard", "kanban", "priorizacao", "documentacao", "componentes", "configuracoes"] as const;
export const ACTIONS = ["visualizar", "criar", "editar", "deletar"] as const;

export type ModuleName = typeof MODULES[number];
export type ActionName = typeof ACTIONS[number];

// Padrão dos 4 papéis de sistema
export const DEFAULT_PERMISSIONS: Record<string, Partial<Record<ModuleName, Partial<Record<ActionName, boolean>>>>> = {
  GERENTE: {
    dashboard: { visualizar: true, criar: true, editar: true, deletar: true },
    kanban: { visualizar: true, criar: true, editar: true, deletar: true },
    priorizacao: { visualizar: true, criar: true, editar: true, deletar: true },
    documentacao: { visualizar: true, criar: true, editar: true, deletar: true },
    componentes: { visualizar: true, criar: true, editar: true, deletar: true },
    configuracoes: { visualizar: true, criar: true, editar: true, deletar: true },
  },
  LIDER: {
    dashboard: { visualizar: true, criar: false, editar: true, deletar: false },
    kanban: { visualizar: true, criar: true, editar: true, deletar: true },
    priorizacao: { visualizar: true, criar: true, editar: true, deletar: false },
    documentacao: { visualizar: true, criar: true, editar: true, deletar: false },
    componentes: { visualizar: true, criar: true, editar: true, deletar: false },
    configuracoes: { visualizar: true, criar: false, editar: false, deletar: false },
  },
  DESENVOLVEDOR: {
    dashboard: { visualizar: true, criar: false, editar: false, deletar: false },
    kanban: { visualizar: true, criar: true, editar: true, deletar: false },
    priorizacao: { visualizar: true, criar: false, editar: false, deletar: false },
    documentacao: { visualizar: true, criar: true, editar: true, deletar: false },
    componentes: { visualizar: true, criar: true, editar: true, deletar: false },
    configuracoes: { visualizar: true, criar: false, editar: false, deletar: false },
  },
  QA: {
    dashboard: { visualizar: true, criar: false, editar: false, deletar: false },
    kanban: { visualizar: true, criar: true, editar: true, deletar: false },
    priorizacao: { visualizar: true, criar: false, editar: true, deletar: false },
    documentacao: { visualizar: true, criar: true, editar: true, deletar: false },
    componentes: { visualizar: true, criar: false, editar: false, deletar: false },
    configuracoes: { visualizar: true, criar: false, editar: false, deletar: false },
  },
};

export class RbacService {
  constructor(
    private perms: RolePermissionRepository = rolePermissionRepository,
    private roles: CustomRoleRepository = customRoleRepository
  ) {}

  async seedDefaults() {
    for (const [roleName, modules] of Object.entries(DEFAULT_PERMISSIONS)) {
      for (const module of MODULES) {
        const modPerms = modules[module] || {};
        for (const action of ACTIONS) {
          const allowed = modPerms[action] ?? false;
          await this.perms.upsert({ roleName, module, action, allowed });
        }
      }
    }

    const systemRoles = [
      { name: "GERENTE", description: "Gerente de Projeto", isSystem: true },
      { name: "LIDER", description: "Líder Técnico", isSystem: true },
      { name: "DESENVOLVEDOR", description: "Desenvolvedor", isSystem: true },
      { name: "QA", description: "QA / Analista de Testes", isSystem: true },
    ];
    for (const r of systemRoles) {
      const existing = await this.roles.findByName(r.name);
      if (!existing) await this.roles.create(r);
    }
  }

  async getAllRoles() {
    const customRoles = await this.roles.findAll();
    return customRoles;
  }

  async getPermissionsMatrix() {
    const all = await this.perms.findAll();
    const matrix: Record<string, Record<string, Record<string, boolean>>> = {};
    for (const p of all) {
      if (!matrix[p.roleName]) matrix[p.roleName] = {};
      if (!matrix[p.roleName][p.module]) matrix[p.roleName][p.module] = {};
      matrix[p.roleName][p.module][p.action] = p.allowed;
    }
    return { modules: MODULES, actions: ACTIONS, matrix };
  }

  async getPermissionsForRole(roleName: string) {
    const list = await this.perms.findByRole(roleName);
    const map: Record<string, Record<string, boolean>> = {};
    for (const p of list) {
      if (!map[p.module]) map[p.module] = {};
      map[p.module][p.action] = p.allowed;
    }
    for (const m of MODULES) {
      if (!map[m]) map[m] = {};
      for (const a of ACTIONS) {
        if (map[m][a] === undefined) map[m][a] = false;
      }
    }
    return map;
  }

  async setPermission(data: {
    roleName: string;
    module: string;
    action: string;
    allowed: boolean;
    customRoleId?: number | null;
  }) {
    if (!MODULES.includes(data.module as ModuleName)) {
      throw new NotFoundError("Módulo");
    }
    if (!ACTIONS.includes(data.action as ActionName)) {
      throw new NotFoundError("Ação");
    }
    return this.perms.upsert(data);
  }

  async bulkSetPermissions(
    roleName: string,
    perms: Array<{ module: string; action: string; allowed: boolean }>,
    customRoleId?: number | null
  ) {
    const results = [];
    for (const p of perms) {
      results.push(
        await this.perms.upsert({ roleName, module: p.module, action: p.action, allowed: p.allowed, customRoleId })
      );
    }
    return results;
  }

  async createRole(data: { name: string; description?: string }) {
    const existing = await this.roles.findByName(data.name);
    if (existing) throw new ConflictError("Já existe um cargo com este nome");

    const role = await this.roles.create({ name: data.name, description: data.description, isSystem: false });

    // Inicia com todas as permissões negadas
    for (const m of MODULES) {
      for (const a of ACTIONS) {
        await this.perms.upsert({
          roleName: data.name,
          module: m,
          action: a,
          allowed: false,
          customRoleId: role.id,
        });
      }
    }
    return role;
  }

  async deleteRole(id: number) {
    const role = await this.roles.findById(id);
    if (!role) throw new NotFoundError("Cargo");
    if (role.isSystem) throw new ForbiddenError("Cargos de sistema não podem ser excluídos");

    await this.perms.deleteByCustomRole(id);
    await this.roles.delete(id);
  }

  async check(roleName: string, module: string, action: string): Promise<boolean> {
    return this.perms.checkPermission(roleName, module, action);
  }
}

export const rbacService = new RbacService();
