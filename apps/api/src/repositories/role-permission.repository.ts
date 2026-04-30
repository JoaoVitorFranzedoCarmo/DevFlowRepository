import prisma from "../config/database";

export class RolePermissionRepository {
  async findAll() {
    return prisma.rolePermission.findMany();
  }

  async findByRole(roleName: string) {
    return prisma.rolePermission.findMany({ where: { roleName } });
  }

  async findByCustomRole(customRoleId: number) {
    return prisma.rolePermission.findMany({ where: { customRoleId } });
  }

  async upsert(data: {
    roleName: string;
    module: string;
    action: string;
    allowed: boolean;
    customRoleId?: number | null;
  }) {
    return prisma.rolePermission.upsert({
      where: {
        roleName_module_action: {
          roleName: data.roleName,
          module: data.module,
          action: data.action,
        },
      },
      create: {
        roleName: data.roleName,
        module: data.module,
        action: data.action,
        allowed: data.allowed,
        customRoleId: data.customRoleId ?? null,
      },
      update: { allowed: data.allowed },
    });
  }

  async checkPermission(roleName: string, module: string, action: string): Promise<boolean> {
    const perm = await prisma.rolePermission.findUnique({
      where: { roleName_module_action: { roleName, module, action } },
    });
    return perm?.allowed ?? false;
  }

  async deleteByCustomRole(customRoleId: number) {
    return prisma.rolePermission.deleteMany({ where: { customRoleId } });
  }
}

export const rolePermissionRepository = new RolePermissionRepository();

export class CustomRoleRepository {
  async findAll() {
    return prisma.customRole.findMany({
      orderBy: { name: "asc" },
      include: { permissions: true },
    });
  }

  async findById(id: number) {
    return prisma.customRole.findUnique({
      where: { id },
      include: { permissions: true },
    });
  }

  async findByName(name: string) {
    return prisma.customRole.findUnique({ where: { name } });
  }

  async create(data: { name: string; description?: string; isSystem?: boolean }) {
    return prisma.customRole.create({
      data: {
        name: data.name,
        description: data.description || "",
        isSystem: data.isSystem || false,
      },
    });
  }

  async update(id: number, data: { name?: string; description?: string }) {
    return prisma.customRole.update({ where: { id }, data });
  }

  async delete(id: number) {
    return prisma.customRole.delete({ where: { id } });
  }
}

export const customRoleRepository = new CustomRoleRepository();
