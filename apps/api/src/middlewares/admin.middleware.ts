import { Request, Response, NextFunction } from "express";
import { UnauthorizedError, ForbiddenError } from "../utils/errors";
import { userService } from "../services/user.service";

// Allows access if req.user.role is in allowedRoles OR user has customRole named ADMINISTRADOR
export function adminOrRoleMiddleware(...allowedRoles: string[]) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    if (!req.user) throw new UnauthorizedError();
    // Fast path: token role allowed
    if (allowedRoles.includes(req.user.role)) return next();

    // Otherwise load user to check customRole
    const user = await userService.findById(req.user.userId);
    if ((user.role as string) === "ADMINISTRADOR" || user.customRole?.name === "ADMINISTRADOR") return next();

    throw new ForbiddenError("Ação restrita a Administrador ou cargo permitido");
  };
}
