import prisma from "../config/database";
import { NotFoundError, ForbiddenError } from "../utils/errors";

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

  async update(
    id: string,
    data: Partial<{ name: string; desc: string; icon: string; uses: number }>,
    user?: { userId: string; role: string }
  ) {
    await this.findById(id);
    if (user && user.role !== "GERENTE") {
      throw new ForbiddenError("Apenas gerentes podem atualizar templates");
    }
    return prisma.template.update({ where: { id }, data });
  }

  async delete(id: string, user?: { userId: string; role: string }) {
    await this.findById(id);
    if (user && user.role !== "GERENTE") {
      throw new ForbiddenError("Apenas gerentes podem excluir templates");
    }
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
