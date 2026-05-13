import prisma from "../config/database";

const docInclude = {
  author: { select: { id: true, name: true, avatar: true } },
  versions: { orderBy: { createdAt: "desc" as const }, take: 20 },
} as const;

// Repository — isola todo acesso Prisma do domínio de documentos.
// Versionamento (createVersion, findVersionsByDocument) e agregações (count, groupByStatus)
// ficam aqui; o DocumentService não conhece detalhes de schema ou joins.
export class DocumentRepository {
  async findMany(where: Record<string, unknown> = {}) {
    return prisma.document.findMany({
      where: where as any,
      include: docInclude,
      orderBy: { createdAt: "desc" },
    });
  }

  async findUnique(id: number) {
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

  async update(id: number, data: Record<string, unknown>) {
    return prisma.document.update({
      where: { id },
      data: data as any,
      include: docInclude,
    });
  }

  async delete(id: number) {
    return prisma.document.delete({ where: { id } });
  }

  async createVersion(data: {
    documentId: number;
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

  async findVersionsByDocument(documentId: number) {
    return prisma.documentVersion.findMany({
      where: { documentId },
      orderBy: { createdAt: "desc" },
    });
  }

  async findVersion(versionId: number) {
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
