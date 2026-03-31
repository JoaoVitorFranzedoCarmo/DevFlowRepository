import { Router } from "express";
import { notificationController } from "../controllers/notification.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { upsertNotificationSchema, bulkNotificationSchema } from "../validators/notification.validator";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.use(authMiddleware);

router.get("/", asyncHandler((req, res) => notificationController.findByUser(req, res)));
router.put("/", validate(upsertNotificationSchema), asyncHandler((req, res) => notificationController.upsert(req, res)));
router.put("/bulk", validate(bulkNotificationSchema), asyncHandler((req, res) => notificationController.bulkUpsert(req, res)));

export default router;
