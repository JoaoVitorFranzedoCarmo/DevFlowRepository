import { Request, Response } from "express";
import { integrationService } from "../services/integration.service";

export class IntegrationController {
  async findByUser(req: Request, res: Response) {
    const integrations = await integrationService.findByUser(req.user!.userId);
    res.json(integrations);
  }

  async create(req: Request, res: Response) {
    const integration = await integrationService.create(req.user!.userId, req.body);
    res.status(201).json(integration);
  }

  async update(req: Request, res: Response) {
    const integration = await integrationService.update(req.params.id, req.body);
    res.json(integration);
  }

  async toggle(req: Request, res: Response) {
    const integration = await integrationService.toggle(req.params.id);
    res.json(integration);
  }

  async delete(req: Request, res: Response) {
    await integrationService.delete(req.params.id);
    res.status(204).send();
  }
}

export const integrationController = new IntegrationController();
