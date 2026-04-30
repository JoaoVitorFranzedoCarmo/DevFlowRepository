import { Router } from "express";
import { taskController } from "../controllers/task.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  createTaskSchema,
  updateTaskSchema,
  taskPrioritizationSchema,
  taskDependencySchema,
  bulkDependenciesSchema,
  moveTaskSchema,
} from "../validators/task.validator";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.use(authMiddleware);

router.get("/dashboard/stats", asyncHandler((req, res) => taskController.getDashboardStats(req, res)));
router.get("/dashboard/cost", asyncHandler((req, res) => taskController.getCostEstimate(req, res)));
router.post("/dashboard/due-soon", asyncHandler((req, res) => taskController.checkDueSoon(req, res)));

router.get("/kanban", asyncHandler((req, res) => taskController.findByStatus(req, res)));
router.get("/prioritized", asyncHandler((req, res) => taskController.getPrioritizedTasks(req, res)));

router.get("/", asyncHandler((req, res) => taskController.findAll(req, res)));
router.get("/:id", asyncHandler((req, res) => taskController.findById(req, res)));
router.post("/", validate(createTaskSchema), asyncHandler((req, res) => taskController.create(req, res)));
router.put("/:id", validate(updateTaskSchema), asyncHandler((req, res) => taskController.update(req, res)));
router.delete("/:id", asyncHandler((req, res) => taskController.delete(req, res)));

router.patch("/:id/move", validate(moveTaskSchema), asyncHandler((req, res) => taskController.moveTask(req, res)));

router.put("/:id/prioritization", validate(taskPrioritizationSchema), asyncHandler((req, res) => taskController.setPrioritization(req, res)));

router.post("/:id/dependencies", validate(taskDependencySchema), asyncHandler((req, res) => taskController.addDependency(req, res)));
router.put("/:id/dependencies", validate(bulkDependenciesSchema), asyncHandler((req, res) => taskController.setDependencies(req, res)));
router.delete("/:id/dependencies/:targetId", asyncHandler((req, res) => taskController.removeDependency(req, res)));

export default router;
