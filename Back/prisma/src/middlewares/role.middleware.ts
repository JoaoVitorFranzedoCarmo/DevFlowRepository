import { Request, Response, NextFunction } from "express";
import { ForbiddenError, UnauthorizedError } from "../utils/errors";

export function roleMiddleware(...allowedRoles: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new UnauthorizedError();
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new ForbiddenError("Seu perfil não tem permissão para esta ação");
    }

    next();
  };
}
