import { Request, Response } from "express";
import { notificationService } from "../services/notification.service";

export class NotificationController {
  async findByUser(req: Request, res: Response) {
    const settings = await notificationService.findByUser(req.user!.userId);
    res.json(settings);
  }

  async upsert(req: Request, res: Response) {
    const setting = await notificationService.upsert(req.user!.userId, req.body);
    res.json(setting);
  }

  async bulkUpsert(req: Request, res: Response) {
    const results = await notificationService.bulkUpsert(req.user!.userId, req.body.settings);
    res.json(results);
  }
}

export const notificationController = new NotificationController();
