import prisma from "../config/database";
import { NotFoundError } from "../utils/errors";

export class TemplateService {
  async findAll() {
    return prisma.template.findMany({ orderBy: { uses: "desc" } });
  }

  async findById(id: string) {
    const template = await prisma.template.findUnique({ where: { id } });
    if (!template) throw new NotFoundError("Template");
    return template;
  }

  async create(data: { name: string; desc: string; icon?: string }) {
    return prisma.template.create({ data });
  }

  async update(id: string, data: Partial<{ name: string; desc: string; icon: string; uses: number }>) {
    await this.findById(id);
    return prisma.template.update({ where: { id }, data });
  }

  async delete(id: string) {
    await this.findById(id);
    await prisma.template.delete({ where: { id } });
  }

  async incrementUses(id: string) {
    await this.findById(id);
    return prisma.template.update({
      where: { id },
      data: { uses: { increment: 1 } },
    });
  }
}

export const templateService = new TemplateService();
