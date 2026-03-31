import prisma from "../config/database";
import { NotFoundError } from "../utils/errors";

export class ComponentService {
  async findAll(filters?: { category?: string; lang?: string; search?: string }) {
    const where: any = {};

    if (filters?.category && filters.category !== "Todos") {
      where.category = filters.category;
    }
    if (filters?.lang && filters.lang !== "Todas") {
      where.lang = filters.lang;
    }
    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: "insensitive" } },
        { desc: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    return prisma.component.findMany({
      where,
      include: {
        author: {
          select: { id: true, name: true, avatar: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(id: string) {
    const component = await prisma.component.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, name: true, avatar: true },
        },
      },
    });
    if (!component) throw new NotFoundError("Componente");
    return component;
  }

  async create(data: {
    name: string;
    desc: string;
    category: string;
    lang: string;
    tags?: string[];
    authorId: string;
  }) {
    return prisma.component.create({
      data,
      include: {
        author: {
          select: { id: true, name: true, avatar: true },
        },
      },
    });
  }

  async update(id: string, data: Partial<{
    name: string;
    desc: string;
    category: string;
    lang: string;
    tags: string[];
    uses: number;
    rating: number;
  }>) {
    await this.findById(id);
    return prisma.component.update({
      where: { id },
      data,
      include: {
        author: {
          select: { id: true, name: true, avatar: true },
        },
      },
    });
  }

  async delete(id: string) {
    await this.findById(id);
    await prisma.component.delete({ where: { id } });
  }

  async getStats() {
    const total = await prisma.component.count();
    const totalUses = await prisma.component.aggregate({ _sum: { uses: true } });
    const categories = await prisma.component.groupBy({
      by: ["category"],
      _count: true,
    });
    return {
      total,
      totalUses: totalUses._sum.uses || 0,
      categories: categories.length,
    };
  }
}

export const componentService = new ComponentService();
