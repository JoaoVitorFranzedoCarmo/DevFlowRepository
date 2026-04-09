import { Request, Response } from "express";
import { componentService } from "../services/component.service";

export class ComponentController {
  async findAll(req: Request, res: Response) {
    const { category, lang, search } = req.query;
    const components = await componentService.findAll({
      category: category as string,
      lang: lang as string,
      search: search as string,
    });
    res.json(components);
  }

  async findById(req: Request, res: Response) {
    const component = await componentService.findById(req.params.id);
    res.json(component);
  }

  async create(req: Request, res: Response) {
    const component = await componentService.create({
      ...req.body,
      authorId: req.user!.userId,
    });
    res.status(201).json(component);
  }

  async update(req: Request, res: Response) {
    const component = await componentService.update(req.params.id, req.body, { userId: req.user!.userId, role: req.user!.role });
    res.json(component);
  }

  async delete(req: Request, res: Response) {
    await componentService.delete(req.params.id, { userId: req.user!.userId, role: req.user!.role });
    res.status(204).send();
  }

  async getStats(_req: Request, res: Response) {
    const stats = await componentService.getStats();
    res.json(stats);
  }
}

export const componentController = new ComponentController();
