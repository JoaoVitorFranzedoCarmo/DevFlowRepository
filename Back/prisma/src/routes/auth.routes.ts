import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { validate } from "../middlewares/validate.middleware";
import { authMiddleware } from "../middlewares/auth.middleware";
import { registerSchema, loginSchema, refreshTokenSchema } from "../validators/auth.validator";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.post("/register", validate(registerSchema), asyncHandler((req, res) => authController.register(req, res)));
router.post("/login", validate(loginSchema), asyncHandler((req, res) => authController.login(req, res)));
router.post("/refresh", validate(refreshTokenSchema), asyncHandler((req, res) => authController.refreshToken(req, res)));
router.post("/logout", asyncHandler((req, res) => authController.logout(req, res)));
router.get("/me", authMiddleware, asyncHandler((req, res) => authController.me(req, res)));

export default router;
