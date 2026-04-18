import prisma from "../config/database";

export class TemplateRepository {
  async findMany() {
    return prisma.template.findMany({ orderBy: { uses: "desc" } });
  }

  async findUnique(id: string) {
    return prisma.template.findUnique({ where: { id } });
  }

  async create(data: { name: string; desc: string; icon?: string }) {
    return prisma.template.create({ data });
  }

  async update(id: string, data: Record<string, unknown>) {
    return prisma.template.update({
      where: { id },
      data: data as any,
    });
  }

  async delete(id: string) {
    return prisma.template.delete({ where: { id } });
  }

  async incrementUses(id: string) {
    return prisma.template.update({
      where: { id },
      data: { uses: { increment: 1 } },
    });
  }
}

export const templateRepository = new TemplateRepository();
