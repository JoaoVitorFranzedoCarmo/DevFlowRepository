import prisma from "../config/database";

const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  avatar: true,
  createdAt: true,
  customRoleId: true,
  customRole: {
    select: { id: true, name: true },
  },
} as const;

export class UserRepository {
  async findMany() {
    return prisma.user.findMany({
      select: userSelect,
      orderBy: { name: "asc" },
    });
  }

  async findById(id: number) {
    return prisma.user.findUnique({
      where: { id },
      select: userSelect,
    });
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  async findByIdWithPassword(id: number) {
    return prisma.user.findUnique({ where: { id } });
  }

  async create(data: {
    name: string;
    email: string;
    password: string;
    role?: any;
  }) {
    return prisma.user.create({
      data: data as any,
      select: userSelect,
    });
  }

  async update(id: number, data: Record<string, unknown>) {
    return prisma.user.update({
      where: { id },
      data: data as any,
      select: userSelect,
    });
  }

  async delete(id: number) {
    return prisma.user.delete({ where: { id } });
  }

  async count() {
    return prisma.user.count();
  }

  async groupByRole() {
    return prisma.user.groupBy({ by: ["role"], _count: true });
  }
}

export const userRepository = new UserRepository();
