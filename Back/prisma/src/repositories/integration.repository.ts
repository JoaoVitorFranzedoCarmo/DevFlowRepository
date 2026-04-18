import prisma from "../config/database";

export class IntegrationRepository {
  async findByUser(userId: string) {
    return prisma.integration.findMany({
      where: { userId },
      orderBy: { name: "asc" },
    });
  }

  async findUnique(id: string) {
    return prisma.integration.findUnique({ where: { id } });
  }

  async create(data: { name: string; desc: string; status: string; icon: string; userId: string }) {
    return prisma.integration.create({ data });
  }

  async update(id: string, data: Record<string, unknown>) {
    return prisma.integration.update({
      where: { id },
      data: data as any,
    });
  }

  async delete(id: string) {
    return prisma.integration.delete({ where: { id } });
  }
}

export const integrationRepository = new IntegrationRepository();
