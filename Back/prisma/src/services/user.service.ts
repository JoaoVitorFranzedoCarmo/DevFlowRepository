import prisma from "../config/database";
import { NotFoundError } from "../utils/errors";

export class UserService {
  async findAll() {
    return prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        createdAt: true,
      },
      orderBy: { name: "asc" },
    });
  }

  async findById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        createdAt: true,
      },
    });
    if (!user) throw new NotFoundError("Usuário");
    return user;
  }

  async update(id: string, data: { name?: string; email?: string; role?: string; avatar?: string | null }) {
    await this.findById(id);
    return prisma.user.update({
      where: { id },
      data: data as any,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        createdAt: true,
      },
    });
  }

  async delete(id: string) {
    await this.findById(id);
    await prisma.user.delete({ where: { id } });
  }
}

export const userService = new UserService();
