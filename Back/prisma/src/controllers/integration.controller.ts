import { Request, Response } from "express";
import { integrationService } from "../services/integration.service";
import { ForbiddenError } from "../utils/errors";

export class IntegrationController {
  async findByUser(req: Request, res: Response) {
    const integrations = await integrationService.findByUser(req.user!.userId);
    res.json(integrations);
  }

  async findById(req: Request, res: Response) {
    const integration = await integrationService.findById(parseInt(req.params.id));
    if (integration.userId !== req.user!.userId && req.user!.role !== "GERENTE") {
      throw new ForbiddenError("Permissão negada para visualizar esta integração");
    }
    res.json(integration);
  }

  async create(req: Request, res: Response) {
    const integration = await integrationService.create(req.user!.userId, req.body);
    res.status(201).json(integration);
  }

  async update(req: Request, res: Response) {
    const integration = await integrationService.findById(parseInt(req.params.id));
    if (integration.userId !== req.user!.userId && req.user!.role !== "GERENTE") {
      throw new ForbiddenError("Permissão negada para atualizar integração");
    }
    const updated = await integrationService.update(parseInt(req.params.id), req.body);
    res.json(updated);
  }

  async toggle(req: Request, res: Response) {
    const integration = await integrationService.findById(parseInt(req.params.id));
    if (integration.userId !== req.user!.userId && req.user!.role !== "GERENTE") {
      throw new ForbiddenError("Permissão negada para alterar integração");
    }
    const toggled = await integrationService.toggle(parseInt(req.params.id));
    res.json(toggled);
  }

  async delete(req: Request, res: Response) {
    const integration = await integrationService.findById(parseInt(req.params.id));
    if (integration.userId !== req.user!.userId && req.user!.role !== "GERENTE") {
      throw new ForbiddenError("Permissão negada para deletar integração");
    }
    await integrationService.delete(parseInt(req.params.id));
    res.status(204).send();
  }
}

export const integrationController = new IntegrationController();
