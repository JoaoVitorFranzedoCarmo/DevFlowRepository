import { Request, Response } from "express";
import { rbacService } from "../services/rbac.service";

export class RbacController {
  async getRoles(_req: Request, res: Response) {
    const roles = await rbacService.getAllRoles();
    res.json(roles);
  }

  async getMatrix(_req: Request, res: Response) {
    const matrix = await rbacService.getPermissionsMatrix();
    res.json(matrix);
  }

  async getMyPermissions(req: Request, res: Response) {
    const perms = await rbacService.getPermissionsForRole(req.user!.role);
    res.json({ role: req.user!.role, permissions: perms });
  }

  async getRolePermissions(req: Request, res: Response) {
    const perms = await rbacService.getPermissionsForRole(req.params.roleName);
    res.json({ role: req.params.roleName, permissions: perms });
  }

  async setPermission(req: Request, res: Response) {
    const result = await rbacService.setPermission(req.body);
    res.json(result);
  }

  async bulkSetPermissions(req: Request, res: Response) {
    const { roleName, permissions, customRoleId } = req.body;
    const result = await rbacService.bulkSetPermissions(roleName, permissions, customRoleId ?? null);
    res.json(result);
  }

  async createRole(req: Request, res: Response) {
    const role = await rbacService.createRole(req.body);
    res.status(201).json(role);
  }

  async deleteRole(req: Request, res: Response) {
    await rbacService.deleteRole(parseInt(req.params.id));
    res.status(204).send();
  }
}

export const rbacController = new RbacController();
