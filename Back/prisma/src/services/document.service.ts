import prisma from "../config/database";
import { NotFoundError, ForbiddenError } from "../utils/errors";
import {
  DocumentGenerationStrategy,
  HtmlGenerationStrategy,
  PdfGenerationStrategy,
} from "../strategies/document-generation.strategy";

export class DocumentService {
  constructor(
    private generationStrategy: DocumentGenerationStrategy = new HtmlGenerationStrategy()
  ) {}

  setGenerationStrategy(strategy: DocumentGenerationStrategy): void {
    this.generationStrategy = strategy;
  }

  async findAll(filters?: { type?: string; status?: string; search?: string }) {
    const where: any = {};
    if (filters?.type && filters.type !== "todos") where.type = filters.type.toUpperCase();
    if (filters?.status && filters.status !== "todos") where.status = filters.status.toUpperCase();
    if (filters?.search) {
      where.title = { contains: filters.search, mode: "insensitive" };
    }

    return prisma.document.findMany({
      where,
      include: {
        author: { select: { id: true, name: true, avatar: true } },
        versions: { orderBy: { createdAt: "desc" }, take: 5 },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(id: string) {
    const doc = await prisma.document.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true, avatar: true } },
        versions: { orderBy: { createdAt: "desc" } },
      },
    });
    if (!doc) throw new NotFoundError("Documento");
    return doc;
  }

  async create(data: {
    title: string;
    type?: string;
    format?: string;
    version?: string;
    codeVersion?: string;
    status?: string;
    pages?: number;
    authorId: string;
  }) {
    return prisma.document.create({
      data: {
        title: data.title,
        type: (data.type as any) || "TECNICA",
        format: (data.format as any) || "HTML",
        version: data.version || "v1.0.0",
        codeVersion: data.codeVersion || "",
        status: (data.status as any) || "RASCUNHO",
        pages: data.pages || 0,
        authorId: data.authorId,
      },
      include: {
        author: { select: { id: true, name: true, avatar: true } },
        versions: true,
      },
    });
  }

  async update(id: string, data: Partial<{
    title: string;
    type: string;
    format: string;
    version: string;
    codeVersion: string;
    status: string;
    pages: number;
  }>) {
    await this.findById(id);
    const updateData: any = { ...data };
    if (data.type) updateData.type = data.type;
    if (data.format) updateData.format = data.format;
    if (data.status) updateData.status = data.status;

    return prisma.document.update({
      where: { id },
      data: updateData,
      include: {
        author: { select: { id: true, name: true, avatar: true } },
        versions: { orderBy: { createdAt: "desc" }, take: 5 },
      },
    });
  }

  async delete(id: string) {
    await this.findById(id);
    await prisma.document.delete({ where: { id } });
  }

  async addVersion(documentId: string, data: {
    version: string;
    commit: string;
    changes: string;
    author: string;
  }, user?: { userId: string; role: string }) {
    const doc = await this.findById(documentId);
    if (user) {
      if (doc.authorId !== user.userId && user.role !== "GERENTE") {
        throw new ForbiddenError("Permissão negada para adicionar versão ao documento");
      }
    }

    const docVersion = await prisma.documentVersion.create({
      data: { documentId, ...data },
    });

    await prisma.document.update({
      where: { id: documentId },
      data: { version: data.version, codeVersion: data.commit },
    });

    return docVersion;
  }

  async getVersionHistory() {
    return prisma.documentVersion.findMany({
      include: {
        document: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async getStats() {
    const total = await prisma.document.count();
    const byStatus = await prisma.document.groupBy({ by: ["status"], _count: true });
    const totalPages = await prisma.document.aggregate({ _sum: { pages: true } });
    const templates = await prisma.template.count();

    const statusMap: Record<string, number> = {};
    byStatus.forEach((s) => { statusMap[s.status] = s._count; });

    return {
      total,
      updated: statusMap["ATUALIZADO"] || 0,
      outdated: statusMap["DESATUALIZADO"] || 0,
      drafts: statusMap["RASCUNHO"] || 0,
      totalPages: totalPages._sum.pages || 0,
      templates,
    };
  }

  // Strategy: seleciona a estratégia de geração de conteúdo com base no formato do documento
  async generateContent(id: string, formatOverride?: string): Promise<string> {
    const doc = await this.findById(id);

    const targetFormat = (formatOverride ?? doc.format).toUpperCase();
    const strategy: DocumentGenerationStrategy =
      targetFormat === "PDF" ? new PdfGenerationStrategy() : new HtmlGenerationStrategy();

    return strategy.generate({
      title: doc.title,
      type: doc.type,
      version: doc.version,
      status: doc.status,
      author: doc.author?.name,
      createdAt: doc.createdAt,
    });
  }
}

export const documentService = new DocumentService();
