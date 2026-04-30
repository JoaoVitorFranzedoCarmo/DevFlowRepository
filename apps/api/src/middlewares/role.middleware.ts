import { Request, Response, NextFunction } from "express";
import { ForbiddenError, UnauthorizedError } from "../utils/errors";
import { rbacService } from "../services/rbac.service";

// Modo legado: roleMiddleware("GERENTE", "LIDER") — checa se req.user.role está em allowedRoles
export function roleMiddleware(...allowedRoles: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) throw new UnauthorizedError();
    if (!allowedRoles.includes(req.user.role)) {
      throw new ForbiddenError("Seu perfil não tem permissão para esta ação");
    }
    next();
  };
}

// Modo dinâmico: requirePermission("kanban", "editar") — consulta matriz do BD
export function requirePermission(module: string, action: string) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    if (!req.user) throw new UnauthorizedError();
    const allowed = await rbacService.check(req.user.role, module, action);
    if (!allowed) {
      throw new ForbiddenError(`Sem permissão para ${action} em ${module}`);
    }
    next();
  };
}
