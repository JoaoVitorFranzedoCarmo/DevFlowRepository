import { Router } from "express";
import { systemConfigController } from "../controllers/system-config.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.use(authMiddleware);

router.get("/", asyncHandler((req, res) => systemConfigController.getAll(req, res)));
router.get("/:key", asyncHandler((req, res) => systemConfigController.get(req, res)));
router.put("/", roleMiddleware("GERENTE"), asyncHandler((req, res) => systemConfigController.set(req, res)));

export default router;
