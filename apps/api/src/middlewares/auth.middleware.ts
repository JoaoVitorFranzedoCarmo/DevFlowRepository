import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { UnauthorizedError } from "../utils/errors";
import { JwtPayload } from "@devflow/types";

// Re-exporta para que importadores existentes (auth.service.ts) não precisem mudar
export type { JwtPayload };

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export function authMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthorizedError("Token não fornecido");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    req.user = decoded;
    next();
  } catch {
    throw new UnauthorizedError("Token inválido ou expirado");
  }
}
