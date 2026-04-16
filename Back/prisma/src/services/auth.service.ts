import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/database";
import { env } from "../config/env";
import { ConflictError, UnauthorizedError } from "../utils/errors";
import { JwtPayload } from "../middlewares/auth.middleware";

export class AuthService {
  async register(data: { name: string; email: string; password: string; role?: string }) {
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      throw new ConflictError("E-mail já cadastrado");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: (data.role as any) || "DESENVOLVEDOR",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        createdAt: true,
      },
    });

    const tokens = await this.generateTokens(user.id, user.role);

    return { user, ...tokens };
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedError("E-mail ou senha inválidos");
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new UnauthorizedError("E-mail ou senha inválidos");
    }

    const tokens = await this.generateTokens(user.id, user.role);

    const { password: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, ...tokens };
  }

  async refreshToken(token: string) {
    const stored = await prisma.refreshToken.findUnique({ where: { token } });
    if (!stored || stored.expiresAt < new Date()) {
      if (stored) {
        await prisma.refreshToken.delete({ where: { id: stored.id } });
      }
      throw new UnauthorizedError("Refresh token inválido ou expirado");
    }

    let payload: JwtPayload;
    try {
      payload = jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtPayload;
    } catch {
      await prisma.refreshToken.delete({ where: { id: stored.id } });
      throw new UnauthorizedError("Refresh token inválido");
    }

    // Delete old token
    await prisma.refreshToken.delete({ where: { id: stored.id } });

    // Generate new pair
    const tokens = await this.generateTokens(payload.userId, payload.role);
    return tokens;
  }

  async logout(token: string) {
    await prisma.refreshToken.deleteMany({ where: { token } });
  }

  private async generateTokens(userId: string, role: string) {
      const accessToken = jwt.sign({ userId, role }, env.JWT_SECRET, {
          expiresIn: env.JWT_EXPIRES_IN as any,
      });

      const refreshToken = jwt.sign({ userId, role }, env.JWT_REFRESH_SECRET, {
          expiresIn: env.JWT_REFRESH_EXPIRES_IN as any,
      });

    // Parse expiration
    const refreshDays = parseInt(env.JWT_REFRESH_EXPIRES_IN) || 7;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + refreshDays);

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId,
        expiresAt,
      },
    });

    return { accessToken, refreshToken };
  }
}

export const authService = new AuthService();
