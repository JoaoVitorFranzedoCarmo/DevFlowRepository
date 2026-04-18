import { NotFoundError, ForbiddenError } from "../utils/errors";
import {
  DocumentGenerationStrategy,
  HtmlGenerationStrategy,
  PdfGenerationStrategy,
  MarkdownGenerationStrategy,
} from "../strategies/document-generation.strategy";
import { DocumentRepository, documentRepository } from "../repositories/document.repository";

export class DocumentService {
  constructor(
    private repo: DocumentRepository = documentRepository,
    private generationStrategy: DocumentGenerationStrategy = new HtmlGenerationStrategy()
  ) {}

  setGenerationStrategy(strategy: DocumentGenerationStrategy): void {
    this.generationStrategy = strategy;
  }

  async findAll(filters?: { type?: string; status?: string; search?: string }) {
    const where: Record<string, unknown> = {};
    if (filters?.type && filters.type !== "todos") where.type = filters.type.toUpperCase();
    if (filters?.status && filters.status !== "todos") where.status = filters.status.toUpperCase();
    if (filters?.search) {
      where.title = { contains: filters.search, mode: "insensitive" };
    }
    return this.repo.findMany(where);
  }

  async findById(id: string) {
    const doc = await this.repo.findUnique(id);
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
    sourceCode?: string;
    content?: string;
    authorId: string;
  }) {
    return this.repo.create({
      title: data.title,
      type: (data.type as any) || "TECNICA",
      format: (data.format as any) || "HTML",
      version: data.version || "v1.0.0",
      codeVersion: data.codeVersion || "",
      status: (data.status as any) || "RASCUNHO",
      pages: data.pages || 0,
      sourceCode: data.sourceCode || "",
      content: data.content || "",
      authorId: data.authorId,
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
    sourceCode: string;
    content: string;
  }>) {
    await this.findById(id);
    return this.repo.update(id, data as Record<string, unknown>);
  }

  async delete(id: string) {
    await this.findById(id);
    await this.repo.delete(id);
  }

  async addVersion(
    documentId: string,
    data: { version: string; commit: string; changes: string; author: string; content?: string },
    user?: { userId: string; role: string }
  ) {
    const doc = await this.findById(documentId);
    if (user && doc.authorId !== user.userId && user.role !== "GERENTE") {
      throw new ForbiddenError("Permissão negada para adicionar versão ao documento");
    }

    const docVersion = await this.repo.createVersion({
      documentId,
      version: data.version,
      commit: data.commit,
      changes: data.changes,
      author: data.author,
      content: data.content ?? doc.content,
    });

    await this.repo.update(documentId, { version: data.version, codeVersion: data.commit });
    return docVersion;
  }

  async getVersionHistory() {
    return this.repo.findAllVersions();
  }

  async getDocumentVersions(documentId: string) {
    await this.findById(documentId);
    return this.repo.findVersionsByDocument(documentId);
  }

  async restoreVersion(documentId: string, versionId: string, user?: { userId: string; role: string }) {
    const doc = await this.findById(documentId);
    if (user && doc.authorId !== user.userId && user.role !== "GERENTE") {
      throw new ForbiddenError("Permissão negada para restaurar versão");
    }
    const version = await this.repo.findVersion(versionId);
    if (!version) throw new NotFoundError("Versão");
    if (version.documentId !== documentId) {
      throw new NotFoundError("Versão não pertence ao documento");
    }

    await this.repo.createVersion({
      documentId,
      version: `${doc.version}-pre-restore`,
      commit: "",
      changes: `Backup antes de restaurar para ${version.version}`,
      author: user?.userId || doc.author?.name || "Sistema",
      content: doc.content,
    });

    return this.repo.update(documentId, {
      content: version.content,
      version: version.version,
    });
  }

  async getStats() {
    const total = await this.repo.count();
    const byStatus = await this.repo.groupByStatus();
    const totalPages = await this.repo.sumPages();
    const templates = await this.repo.countTemplates();

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

  // Gera conteúdo dinâmico a partir de sourceCode, usando Strategy
  async generateContent(id: string, formatOverride?: string, customSource?: string): Promise<string> {
    const doc = await this.findById(id);
    const targetFormat = (formatOverride ?? doc.format).toUpperCase();

    let strategy: DocumentGenerationStrategy;
    if (targetFormat === "PDF") strategy = new PdfGenerationStrategy();
    else if (targetFormat === "MARKDOWN") strategy = new MarkdownGenerationStrategy();
    else strategy = new HtmlGenerationStrategy();

    return strategy.generate({
      title: doc.title,
      type: doc.type,
      version: doc.version,
      status: doc.status,
      author: doc.author?.name,
      createdAt: doc.createdAt,
      sourceCode: customSource ?? doc.sourceCode,
    });
  }

  // Gera e salva o conteúdo no documento + registra versão
  async generateAndSave(
    id: string,
    opts: { sourceCode?: string; format?: string; commit?: string; changes?: string },
    user?: { userId: string; role: string; name?: string }
  ) {
    const doc = await this.findById(id);
    if (user && doc.authorId !== user.userId && user.role !== "GERENTE") {
      throw new ForbiddenError("Permissão negada para gerar/salvar conteúdo");
    }

    const generated = await this.generateContent(id, opts.format, opts.sourceCode);

    const updateData: Record<string, unknown> = { content: generated, status: "ATUALIZADO" };
    if (opts.sourceCode !== undefined) updateData.sourceCode = opts.sourceCode;
    if (opts.format) updateData.format = opts.format;

    const updated = await this.repo.update(id, updateData);

    const nextVersion = bumpVersion(doc.version);
    await this.repo.createVersion({
      documentId: id,
      version: nextVersion,
      commit: opts.commit || "",
      changes: opts.changes || "Geração automática de conteúdo",
      author: user?.name || doc.author?.name || "Sistema",
      content: generated,
    });
    await this.repo.update(id, { version: nextVersion });

    return { ...updated, content: generated, version: nextVersion };
  }
}

function bumpVersion(current: string): string {
  const match = current.match(/^v?(\d+)\.(\d+)\.(\d+)$/);
  if (!match) return `${current}-r${Date.now()}`;
  const [, maj, min, patch] = match;
  return `v${maj}.${min}.${Number(patch) + 1}`;
}

export const documentService = new DocumentService();
