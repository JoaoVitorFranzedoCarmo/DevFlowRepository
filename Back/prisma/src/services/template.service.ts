import { NotFoundError, ForbiddenError } from "../utils/errors";
import { TemplateRepository, templateRepository } from "../repositories/template.repository";

export class TemplateService {
  constructor(private repo: TemplateRepository = templateRepository) {}

  async findAll() {
    return this.repo.findMany();
  }

  async findById(id: string) {
    const template = await this.repo.findUnique(id);
    if (!template) throw new NotFoundError("Template");
    return template;
  }

  async create(data: { name: string; desc: string; icon?: string }) {
    return this.repo.create(data);
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
    return this.repo.update(id, data);
  }

  async delete(id: string, user?: { userId: string; role: string }) {
    await this.findById(id);
    if (user && user.role !== "GERENTE") {
      throw new ForbiddenError("Apenas gerentes podem excluir templates");
    }
    await this.repo.delete(id);
  }

  async incrementUses(id: string) {
    await this.findById(id);
    return this.repo.incrementUses(id);
  }
}

export const templateService = new TemplateService();
