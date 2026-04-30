import { Router } from "express";
import { userController } from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";
import { validate } from "../middlewares/validate.middleware";
import { updateUserSchema } from "../validators/user.validator";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.use(authMiddleware);

router.get("/", asyncHandler((req, res) => userController.findAll(req, res)));
router.get("/:id", asyncHandler((req, res) => userController.findById(req, res)));
router.put("/:id", validate(updateUserSchema), asyncHandler((req, res) => userController.update(req, res)));
router.delete("/:id", roleMiddleware("GERENTE"), asyncHandler((req, res) => userController.delete(req, res)));

export default router;
