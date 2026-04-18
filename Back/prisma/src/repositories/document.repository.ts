import prisma from "../config/database";

const docInclude = {
  author: { select: { id: true, name: true, avatar: true } },
  versions: { orderBy: { createdAt: "desc" as const }, take: 20 },
} as const;

export class DocumentRepository {
  async findMany(where: Record<string, unknown> = {}) {
    return prisma.document.findMany({
      where: where as any,
      include: docInclude,
      orderBy: { createdAt: "desc" },
    });
  }

  async findUnique(id: string) {
    return prisma.document.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true, avatar: true } },
        versions: { orderBy: { createdAt: "desc" } },
      },
    });
  }

  async create(data: Record<string, unknown>) {
    return prisma.document.create({
      data: data as any,
      include: docInclude,
    });
  }

  async update(id: string, data: Record<string, unknown>) {
    return prisma.document.update({
      where: { id },
      data: data as any,
      include: docInclude,
    });
  }

  async delete(id: string) {
    return prisma.document.delete({ where: { id } });
  }

  async createVersion(data: {
    documentId: string;
    version: string;
    commit: string;
    changes: string;
    author: string;
    content: string;
  }) {
    return prisma.documentVersion.create({ data });
  }

  async findAllVersions() {
    return prisma.documentVersion.findMany({
      include: { document: { select: { id: true, title: true } } },
      orderBy: { createdAt: "desc" },
    });
  }

  async findVersionsByDocument(documentId: string) {
    return prisma.documentVersion.findMany({
      where: { documentId },
      orderBy: { createdAt: "desc" },
    });
  }

  async findVersion(versionId: string) {
    return prisma.documentVersion.findUnique({ where: { id: versionId } });
  }

  async count() {
    return prisma.document.count();
  }

  async groupByStatus() {
    return prisma.document.groupBy({ by: ["status"], _count: true });
  }

  async sumPages() {
    return prisma.document.aggregate({ _sum: { pages: true } });
  }

  async countTemplates() {
    return prisma.template.count();
  }
}

export const documentRepository = new DocumentRepository();
