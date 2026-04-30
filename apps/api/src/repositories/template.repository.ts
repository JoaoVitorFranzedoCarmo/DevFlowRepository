import prisma from "../config/database";

export class TemplateRepository {
  async findMany() {
    return prisma.template.findMany({ orderBy: { uses: "desc" } });
  }

  async findUnique(id: number) {
    return prisma.template.findUnique({ where: { id } });
  }

  async create(data: { name: string; desc: string; icon?: string }) {
    return prisma.template.create({ data });
  }

  async update(id: number, data: Record<string, unknown>) {
    return prisma.template.update({
      where: { id },
      data: data as any,
    });
  }

  async delete(id: number) {
    return prisma.template.delete({ where: { id } });
  }

  async incrementUses(id: number) {
    return prisma.template.update({
      where: { id },
      data: { uses: { increment: 1 } },
    });
  }
}

export const templateRepository = new TemplateRepository();
