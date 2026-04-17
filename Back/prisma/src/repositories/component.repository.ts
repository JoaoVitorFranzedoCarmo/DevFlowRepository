import prisma from "../config/database";

const componentInclude = {
  author: {
    select: { id: true, name: true, avatar: true },
  },
} as const;

export class ComponentRepository {
  async findMany(where: Record<string, unknown> = {}) {
    return prisma.component.findMany({
      where: where as any,
      include: componentInclude,
      orderBy: { createdAt: "desc" },
    });
  }

  async findUnique(id: string) {
    return prisma.component.findUnique({
      where: { id },
      include: componentInclude,
    });
  }

  async create(data: {
    name: string;
    desc: string;
    category: string;
    lang: string;
    tags?: string[];
    authorId: string;
  }) {
    return prisma.component.create({ data, include: componentInclude });
  }

  async update(id: string, data: Record<string, unknown>) {
    return prisma.component.update({
      where: { id },
      data: data as any,
      include: componentInclude,
    });
  }

  async delete(id: string) {
    return prisma.component.delete({ where: { id } });
  }

  async count() {
    return prisma.component.count();
  }

  async aggregateUses() {
    return prisma.component.aggregate({ _sum: { uses: true } });
  }

  async groupByCategory() {
    return prisma.component.groupBy({ by: ["category"], _count: true });
  }
}

export const componentRepository = new ComponentRepository();
