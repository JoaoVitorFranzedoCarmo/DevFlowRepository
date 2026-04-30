import prisma from "../config/database";

export class SystemConfigRepository {
  async get(key: string): Promise<string | null> {
    const entry = await prisma.systemConfig.findUnique({ where: { key } });
    return entry?.value ?? null;
  }

  async getAll() {
    return prisma.systemConfig.findMany();
  }

  async set(key: string, value: string) {
    return prisma.systemConfig.upsert({
      where: { key },
      create: { key, value },
      update: { value },
    });
  }

  async delete(key: string) {
    return prisma.systemConfig.delete({ where: { key } });
  }
}

export const systemConfigRepository = new SystemConfigRepository();
