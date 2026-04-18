import { Request, Response } from "express";
import { notificationService } from "../services/notification.service";

export class NotificationController {
  // Feed de notificações reais
  async feed(req: Request, res: Response) {
    const feed = await notificationService.feed(req.user!.userId);
    res.json(feed);
  }

  async markRead(req: Request, res: Response) {
    const result = await notificationService.markRead(req.user!.userId, req.params.id);
    res.json(result);
  }

  async markAllRead(req: Request, res: Response) {
    const result = await notificationService.markAllRead(req.user!.userId);
    res.json(result);
  }

  // Settings (preferências de notificação por usuário)
  async findSettings(req: Request, res: Response) {
    const settings = await notificationService.findSettings(req.user!.userId);
    res.json(settings);
  }

  async upsertSetting(req: Request, res: Response) {
    const setting = await notificationService.upsertSetting(req.user!.userId, req.body);
    res.json(setting);
  }

  async bulkUpsertSettings(req: Request, res: Response) {
    const results = await notificationService.bulkUpsertSettings(req.user!.userId, req.body.settings);
    res.json(results);
  }
}

export const notificationController = new NotificationController();
