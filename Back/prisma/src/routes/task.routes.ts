import { Router } from "express";
import { taskController } from "../controllers/task.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  createTaskSchema,
  updateTaskSchema,
  taskPrioritizationSchema,
  taskDependencySchema,
  moveTaskSchema,
} from "../validators/task.validator";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.use(authMiddleware);

// Dashboard stats
router.get("/dashboard/stats", asyncHandler((req, res) => taskController.getDashboardStats(req, res)));

// Kanban board view (grouped by status)
router.get("/kanban", asyncHandler((req, res) => taskController.findByStatus(req, res)));

// Prioritized tasks
router.get("/prioritized", asyncHandler((req, res) => taskController.getPrioritizedTasks(req, res)));

// CRUD
router.get("/", asyncHandler((req, res) => taskController.findAll(req, res)));
router.get("/:id", asyncHandler((req, res) => taskController.findById(req, res)));
router.post("/", validate(createTaskSchema), asyncHandler((req, res) => taskController.create(req, res)));
router.put("/:id", validate(updateTaskSchema), asyncHandler((req, res) => taskController.update(req, res)));
router.delete("/:id", asyncHandler((req, res) => taskController.delete(req, res)));

// Move task (Kanban drag & drop)
router.patch("/:id/move", validate(moveTaskSchema), asyncHandler((req, res) => taskController.moveTask(req, res)));

// Prioritization
router.put("/:id/prioritization", validate(taskPrioritizationSchema), asyncHandler((req, res) => taskController.setPrioritization(req, res)));

// Dependencies
router.post("/:id/dependencies", validate(taskDependencySchema), asyncHandler((req, res) => taskController.addDependency(req, res)));
router.delete("/:id/dependencies/:targetId", asyncHandler((req, res) => taskController.removeDependency(req, res)));

export default router;
