import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { ConflictError, UnauthorizedError } from "../utils/errors";
import { JwtPayload } from "../middlewares/auth.middleware";
import { UserRepository, userRepository } from "../repositories/user.repository";
import { RefreshTokenRepository, refreshTokenRepository } from "../repositories/refresh-token.repository";

export class AuthService {
  constructor(
    private users: UserRepository = userRepository,
    private refreshTokens: RefreshTokenRepository = refreshTokenRepository
  ) {}

  async register(data: { name: string; email: string; password: string; role?: string }) {
    const existing = await this.users.findByEmail(data.email);
    if (existing) throw new ConflictError("E-mail já cadastrado");

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.users.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role || "DESENVOLVEDOR",
    });

    const tokens = await this.generateTokens(user.id, user.role);
    return { user, ...tokens };
  }

  async login(email: string, password: string) {
    const user = await this.users.findByEmail(email);
    if (!user) throw new UnauthorizedError("E-mail ou senha inválidos");

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) throw new UnauthorizedError("E-mail ou senha inválidos");

    const tokens = await this.generateTokens(user.id, user.role);
    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, ...tokens };
  }

  async refreshToken(token: string) {
    const stored = await this.refreshTokens.findByToken(token);
    if (!stored || stored.expiresAt < new Date()) {
      if (stored) await this.refreshTokens.deleteById(stored.id);
      throw new UnauthorizedError("Refresh token inválido ou expirado");
    }

    let payload: JwtPayload;
    try {
      payload = jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtPayload;
    } catch {
      await this.refreshTokens.deleteById(stored.id);
      throw new UnauthorizedError("Refresh token inválido");
    }

    await this.refreshTokens.deleteById(stored.id);
    return this.generateTokens(payload.userId, payload.role);
  }

  async logout(token: string) {
    await this.refreshTokens.deleteByToken(token);
  }

  private async generateTokens(userId: string, role: string) {
    const accessToken = jwt.sign({ userId, role }, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN as any,
    });
    const refreshToken = jwt.sign({ userId, role }, env.JWT_REFRESH_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN as any,
    });

    const refreshDays = parseInt(env.JWT_REFRESH_EXPIRES_IN) || 7;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + refreshDays);

    await this.refreshTokens.create({ token: refreshToken, userId, expiresAt });
    return { accessToken, refreshToken };
  }
}

export const authService = new AuthService();
