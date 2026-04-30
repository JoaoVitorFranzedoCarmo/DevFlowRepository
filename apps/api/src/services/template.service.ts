import { NotFoundError, ForbiddenError } from "../utils/errors";
import { TemplateRepository, templateRepository } from "../repositories/template.repository";

export class TemplateService {
  constructor(private repo: TemplateRepository = templateRepository) {}

  async findAll() {
    return this.repo.findMany();
  }

  async findById(id: number) {
    const template = await this.repo.findUnique(id);
    if (!template) throw new NotFoundError("Template");
    return template;
  }

  async create(data: { name: string; desc: string; icon?: string }) {
    return this.repo.create(data);
  }

  async update(
    id: number,
    data: Partial<{ name: string; desc: string; icon: string; uses: number }>,
    user?: { userId: number; role: string }
  ) {
    await this.findById(id);
    if (user && user.role !== "GERENTE") {
      throw new ForbiddenError("Apenas gerentes podem atualizar templates");
    }
    return this.repo.update(id, data);
  }

  async delete(id: number, user?: { userId: number; role: string }) {
    await this.findById(id);
    if (user && user.role !== "GERENTE") {
      throw new ForbiddenError("Apenas gerentes podem excluir templates");
    }
    await this.repo.delete(id);
  }

  async incrementUses(id: number) {
    await this.findById(id);
    return this.repo.incrementUses(id);
  }
}

export const templateService = new TemplateService();
