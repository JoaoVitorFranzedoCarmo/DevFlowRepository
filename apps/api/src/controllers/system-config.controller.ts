import { Request, Response } from "express";
import { systemConfigService } from "../services/system-config.service";

export class SystemConfigController {
  async getAll(_req: Request, res: Response) {
    const configs = await systemConfigService.getAll();
    res.json(configs);
  }

  async get(req: Request, res: Response) {
    const value = await systemConfigService.get(req.params.key);
    res.json({ key: req.params.key, value });
  }

  async set(req: Request, res: Response) {
    const { key, value } = req.body;
    const result = await systemConfigService.set(key, String(value));
    res.json(result);
  }
}

export const systemConfigController = new SystemConfigController();
