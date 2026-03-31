import { Router } from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import componentRoutes from "./component.routes";
import lessonRoutes from "./lesson.routes";
import taskRoutes from "./task.routes";
import documentRoutes from "./document.routes";
import templateRoutes from "./template.routes";
import integrationRoutes from "./integration.routes";
import notificationRoutes from "./notification.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/components", componentRoutes);
router.use("/lessons", lessonRoutes);
router.use("/tasks", taskRoutes);
router.use("/documents", documentRoutes);
router.use("/templates", templateRoutes);
router.use("/integrations", integrationRoutes);
router.use("/notifications", notificationRoutes);

export default router;
