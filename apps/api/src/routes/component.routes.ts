import { Router } from "express";
import { componentController } from "../controllers/component.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createComponentSchema, updateComponentSchema } from "../validators/component.validator";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.use(authMiddleware);

router.get("/stats", asyncHandler((req, res) => componentController.getStats(req, res)));
router.get("/", asyncHandler((req, res) => componentController.findAll(req, res)));
router.get("/:id", asyncHandler((req, res) => componentController.findById(req, res)));
router.post("/", validate(createComponentSchema), asyncHandler((req, res) => componentController.create(req, res)));
router.put("/:id", validate(updateComponentSchema), asyncHandler((req, res) => componentController.update(req, res)));
router.delete("/:id", asyncHandler((req, res) => componentController.delete(req, res)));

export default router;
