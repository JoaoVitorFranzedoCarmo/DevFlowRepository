import { Router } from "express";
import { notificationController } from "../controllers/notification.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { upsertNotificationSchema, bulkNotificationSchema } from "../validators/notification.validator";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.use(authMiddleware);

// Feed — notificações reais
router.get("/feed", asyncHandler((req, res) => notificationController.feed(req, res)));
router.patch("/:id/read", asyncHandler((req, res) => notificationController.markRead(req, res)));
router.patch("/read-all", asyncHandler((req, res) => notificationController.markAllRead(req, res)));

// Settings — preferências
router.get("/", asyncHandler((req, res) => notificationController.findSettings(req, res)));
router.put("/", validate(upsertNotificationSchema), asyncHandler((req, res) => notificationController.upsertSetting(req, res)));
router.put("/bulk", validate(bulkNotificationSchema), asyncHandler((req, res) => notificationController.bulkUpsertSettings(req, res)));

export default router;
