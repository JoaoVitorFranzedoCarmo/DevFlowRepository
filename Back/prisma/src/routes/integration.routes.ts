import { Router } from "express";
import { integrationController } from "../controllers/integration.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createIntegrationSchema, updateIntegrationSchema } from "../validators/integration.validator";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.use(authMiddleware);

router.get("/", asyncHandler((req, res) => integrationController.findByUser(req, res)));

router.get("/:id", asyncHandler((req, res) => integrationController.findById(req, res)));
router.post("/", validate(createIntegrationSchema), asyncHandler((req, res) => integrationController.create(req, res)));
router.put("/:id", validate(updateIntegrationSchema), asyncHandler((req, res) => integrationController.update(req, res)));
router.patch("/:id/toggle", asyncHandler((req, res) => integrationController.toggle(req, res)));
router.delete("/:id", asyncHandler((req, res) => integrationController.delete(req, res)));

export default router;
