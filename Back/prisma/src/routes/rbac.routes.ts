import { Router } from "express";
import { rbacController } from "../controllers/rbac.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.use(authMiddleware);

// Todos autenticados podem consultar suas próprias permissões
router.get("/me", asyncHandler((req, res) => rbacController.getMyPermissions(req, res)));

// Demais operações restritas a GERENTE
router.get("/roles", roleMiddleware("GERENTE"), asyncHandler((req, res) => rbacController.getRoles(req, res)));
router.get("/matrix", roleMiddleware("GERENTE"), asyncHandler((req, res) => rbacController.getMatrix(req, res)));
router.get("/role/:roleName", roleMiddleware("GERENTE"), asyncHandler((req, res) => rbacController.getRolePermissions(req, res)));
router.post("/roles", roleMiddleware("GERENTE"), asyncHandler((req, res) => rbacController.createRole(req, res)));
router.delete("/roles/:id", roleMiddleware("GERENTE"), asyncHandler((req, res) => rbacController.deleteRole(req, res)));
router.put("/permission", roleMiddleware("GERENTE"), asyncHandler((req, res) => rbacController.setPermission(req, res)));
router.put("/permissions/bulk", roleMiddleware("GERENTE"), asyncHandler((req, res) => rbacController.bulkSetPermissions(req, res)));

export default router;
