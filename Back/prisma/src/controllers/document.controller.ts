import { Request, Response } from "express";
import { documentService } from "../services/document.service";
import { ForbiddenError } from "../utils/errors";
import { userRepository } from "../repositories/user.repository";

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
    const doc = await documentService.findById(parseInt(req.params.id));
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
    const existing = await documentService.findById(parseInt(req.params.id));
    if (existing.authorId !== req.user!.userId && req.user!.role !== "GERENTE") {
      throw new ForbiddenError("Permissão negada para atualizar documento");
    }
    const doc = await documentService.update(parseInt(req.params.id), req.body);
    res.json(doc);
  }

  async delete(req: Request, res: Response) {
    const existing = await documentService.findById(parseInt(req.params.id));
    if (existing.authorId !== req.user!.userId && req.user!.role !== "GERENTE") {
      throw new ForbiddenError("Permissão negada para deletar documento");
    }
    await documentService.delete(parseInt(req.params.id));
    res.status(204).send();
  }

  async addVersion(req: Request, res: Response) {
    const payload = { ...req.body } as any;
    if (!payload.author) {
      const user = await userRepository.findById(req.user!.userId);
      payload.author = user?.name ?? String(req.user!.userId);
    }
    const version = await documentService.addVersion(parseInt(req.params.id), payload, {
      userId: req.user!.userId,
      role: req.user!.role,
    });
    res.status(201).json(version);
  }

  async getVersionHistory(_req: Request, res: Response) {
    const history = await documentService.getVersionHistory();
    res.json(history);
  }

  async getDocumentVersions(req: Request, res: Response) {
    const versions = await documentService.getDocumentVersions(parseInt(req.params.id));
    res.json(versions);
  }

  async restoreVersion(req: Request, res: Response) {
    const result = await documentService.restoreVersion(parseInt(req.params.id), parseInt(req.params.versionId), {
      userId: req.user!.userId,
      role: req.user!.role,
    });
    res.json(result);
  }

  async getStats(_req: Request, res: Response) {
    const stats = await documentService.getStats();
    res.json(stats);
  }

  async generateContent(req: Request, res: Response) {
    const { format } = req.query;
    const content = await documentService.generateContent(parseInt(req.params.id), format as string | undefined);
    res.type("text/plain").send(content);
  }

  async generateAndSave(req: Request, res: Response) {
    const user = await userRepository.findById(req.user!.userId);
    const result = await documentService.generateAndSave(parseInt(req.params.id), req.body, {
      userId: req.user!.userId,
      role: req.user!.role,
      name: user?.name,
    });
    res.json(result);
  }
}

export const documentController = new DocumentController();
