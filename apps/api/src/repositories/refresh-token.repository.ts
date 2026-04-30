import prisma from "../config/database";

export class RefreshTokenRepository {
  async create(data: { token: string; userId: number; expiresAt: Date }) {
    return prisma.refreshToken.create({ data });
  }

  async findByToken(token: string) {
    return prisma.refreshToken.findUnique({ where: { token } });
  }

  async deleteById(id: number) {
    return prisma.refreshToken.delete({ where: { id } });
  }

  async deleteByToken(token: string) {
    return prisma.refreshToken.deleteMany({ where: { token } });
  }
}

export const refreshTokenRepository = new RefreshTokenRepository();
