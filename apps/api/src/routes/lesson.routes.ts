import { Router } from "express";
import { lessonController } from "../controllers/lesson.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createLessonSchema, updateLessonSchema } from "../validators/lesson.validator";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.use(authMiddleware);

router.get("/", asyncHandler((req, res) => lessonController.findAll(req, res)));
router.get("/:id", asyncHandler((req, res) => lessonController.findById(req, res)));
router.post("/", validate(createLessonSchema), asyncHandler((req, res) => lessonController.create(req, res)));
router.put("/:id", validate(updateLessonSchema), asyncHandler((req, res) => lessonController.update(req, res)));
router.delete("/:id", asyncHandler((req, res) => lessonController.delete(req, res)));

export default router;
