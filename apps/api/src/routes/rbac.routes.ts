import { Router } from "express";
import { rbacController } from "../controllers/rbac.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";
import { adminOrRoleMiddleware } from "../middlewares/admin.middleware";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.use(authMiddleware);

// Todos autenticados podem consultar suas próprias permissões
router.get("/me", asyncHandler((req, res) => rbacController.getMyPermissions(req, res)));

// Demais operações restritas a GERENTE
router.get("/roles", adminOrRoleMiddleware("GERENTE"), asyncHandler((req, res) => rbacController.getRoles(req, res)));
router.get("/matrix", adminOrRoleMiddleware("GERENTE"), asyncHandler((req, res) => rbacController.getMatrix(req, res)));
router.get("/role/:roleName", adminOrRoleMiddleware("GERENTE"), asyncHandler((req, res) => rbacController.getRolePermissions(req, res)));
router.post("/roles", adminOrRoleMiddleware("GERENTE"), asyncHandler((req, res) => rbacController.createRole(req, res)));
router.delete("/roles/:id", adminOrRoleMiddleware("GERENTE"), asyncHandler((req, res) => rbacController.deleteRole(req, res)));
router.put("/permission", adminOrRoleMiddleware("GERENTE"), asyncHandler((req, res) => rbacController.setPermission(req, res)));
router.put("/permissions/bulk", adminOrRoleMiddleware("GERENTE"), asyncHandler((req, res) => rbacController.bulkSetPermissions(req, res)));

export default router;
