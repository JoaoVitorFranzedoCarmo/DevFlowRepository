import { Request, Response } from "express";
import { templateService } from "../services/template.service";

export class TemplateController {
  async findAll(_req: Request, res: Response) {
    const templates = await templateService.findAll();
    res.json(templates);
  }

  async findById(req: Request, res: Response) {
    const template = await templateService.findById(req.params.id);
    res.json(template);
  }

  async create(req: Request, res: Response) {
    const template = await templateService.create(req.body);
    res.status(201).json(template);
  }

  async update(req: Request, res: Response) {
    const template = await templateService.update(req.params.id, req.body, {
      userId: req.user!.userId,
      role: req.user!.role,
    });
    res.json(template);
  }

  async delete(req: Request, res: Response) {
    await templateService.delete(req.params.id, {
      userId: req.user!.userId,
      role: req.user!.role,
    });
    res.status(204).send();
  }

  async incrementUses(req: Request, res: Response) {
    const template = await templateService.incrementUses(req.params.id);
    res.json(template);
  }
}

export const templateController = new TemplateController();
