import { NotFoundError, ForbiddenError } from "../utils/errors";
import { ComponentRepository, componentRepository } from "../repositories/component.repository";

export class ComponentService {
  constructor(private repo: ComponentRepository = componentRepository) {}

  async findAll(filters?: { category?: string; lang?: string; search?: string }) {
    const where: Record<string, unknown> = {};
    if (filters?.category && filters.category !== "Todos") where.category = filters.category;
    if (filters?.lang && filters.lang !== "Todas") where.lang = filters.lang;
    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: "insensitive" } },
        { desc: { contains: filters.search, mode: "insensitive" } },
      ];
    }
    return this.repo.findMany(where);
  }

  async findById(id: string) {
    const component = await this.repo.findUnique(id);
    if (!component) throw new NotFoundError("Componente");
    return component;
  }

  async create(data: {
    name: string;
    desc: string;
    category: string;
    lang: string;
    tags?: string[];
    codeSnippet?: string;
    authorId: string;
  }) {
    return this.repo.create({
      name: data.name,
      desc: data.desc,
      category: data.category,
      lang: data.lang,
      tags: data.tags || [],
      codeSnippet: data.codeSnippet || "",
      authorId: data.authorId,
    });
  }

  async update(
    id: string,
    data: Partial<{
      name: string;
      desc: string;
      category: string;
      lang: string;
      tags: string[];
      uses: number;
      rating: number;
      codeSnippet: string;
    }>,
    user?: { userId: string; role: string }
  ) {
    const component = await this.findById(id);
    if (user) {
      if (component.authorId !== user.userId && user.role !== "GERENTE") {
        throw new ForbiddenError("Permissão negada para atualizar componente");
      }
    }
    return this.repo.update(id, data as Record<string, unknown>);
  }

  async delete(id: string, user?: { userId: string; role: string }) {
    const component = await this.findById(id);
    if (user) {
      if (component.authorId !== user.userId && user.role !== "GERENTE") {
        throw new ForbiddenError("Permissão negada para deletar componente");
      }
    }
    await this.repo.delete(id);
  }

  async getStats() {
    const total = await this.repo.count();
    const totalUses = await this.repo.aggregateUses();
    const categories = await this.repo.groupByCategory();
    return {
      total,
      totalUses: totalUses._sum.uses || 0,
      categories: categories.length,
    };
  }
}

export const componentService = new ComponentService();
