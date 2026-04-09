import { Request, Response } from "express";
import { documentService } from "../services/document.service";
import { ForbiddenError } from "../utils/errors";

export class DocumentController {
  async findAll(req: Request, res: Response) {
    const { type, status, search } = req.query;
    const docs = await documentService.findAll({
      type: type as string,
      status: status as string,
      search: search as string,
    });
    res.json(docs);
  }

  async findById(req: Request, res: Response) {
    const doc = await documentService.findById(req.params.id);
    res.json(doc);
  }

  async create(req: Request, res: Response) {
    const doc = await documentService.create({
      ...req.body,
      authorId: req.user!.userId,
    });
    res.status(201).json(doc);
  }

  async update(req: Request, res: Response) {
    const existing = await documentService.findById(req.params.id);
    if (existing.authorId !== req.user!.userId && req.user!.role !== "GERENTE") {
      throw new ForbiddenError("Permissão negada para atualizar documento");
    }
    const doc = await documentService.update(req.params.id, req.body);
    res.json(doc);
  }

  async delete(req: Request, res: Response) {
    const existing = await documentService.findById(req.params.id);
    if (existing.authorId !== req.user!.userId && req.user!.role !== "GERENTE") {
      throw new ForbiddenError("Permissão negada para deletar documento");
    }
    await documentService.delete(req.params.id);
    res.status(204).send();
  }

  async addVersion(req: Request, res: Response) {
    // Ensure author is the current user unless explicitly allowed
    const payload = { ...req.body } as any;
    if (!payload.author) payload.author = req.user!.name;

    const existing = await documentService.findById(req.params.id);
    if (existing.authorId !== req.user!.userId && req.user!.role !== "GERENTE") {
      throw new ForbiddenError("Permissão negada para adicionar versão ao documento");
    }

    const version = await documentService.addVersion(req.params.id, payload, { userId: req.user!.userId, role: req.user!.role });
    res.status(201).json(version);
  }

  async getVersionHistory(_req: Request, res: Response) {
    const history = await documentService.getVersionHistory();
    res.json(history);
  }

  async getStats(_req: Request, res: Response) {
    const stats = await documentService.getStats();
    res.json(stats);
  }
}

export const documentController = new DocumentController();
