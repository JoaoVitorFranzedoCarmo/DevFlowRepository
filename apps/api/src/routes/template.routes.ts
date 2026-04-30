import { Router } from "express";
import { templateController } from "../controllers/template.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createTemplateSchema, updateTemplateSchema } from "../validators/template.validator";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.use(authMiddleware);

router.get("/", asyncHandler((req, res) => templateController.findAll(req, res)));
router.get("/:id", asyncHandler((req, res) => templateController.findById(req, res)));
router.post("/", validate(createTemplateSchema), asyncHandler((req, res) => templateController.create(req, res)));
router.put("/:id", validate(updateTemplateSchema), asyncHandler((req, res) => templateController.update(req, res)));
router.delete("/:id", asyncHandler((req, res) => templateController.delete(req, res)));
router.post("/:id/use", asyncHandler((req, res) => templateController.incrementUses(req, res)));

export default router;
