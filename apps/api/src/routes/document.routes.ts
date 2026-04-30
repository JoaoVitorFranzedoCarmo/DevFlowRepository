import { Router } from "express";
import { documentController } from "../controllers/document.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  createDocumentSchema,
  updateDocumentSchema,
  createDocVersionSchema,
  generateDocSchema,
} from "../validators/document.validator";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.use(authMiddleware);

router.get("/stats", asyncHandler((req, res) => documentController.getStats(req, res)));
router.get("/versions", asyncHandler((req, res) => documentController.getVersionHistory(req, res)));

router.get("/", asyncHandler((req, res) => documentController.findAll(req, res)));
router.get("/:id", asyncHandler((req, res) => documentController.findById(req, res)));
router.post("/", validate(createDocumentSchema), asyncHandler((req, res) => documentController.create(req, res)));
router.put("/:id", validate(updateDocumentSchema), asyncHandler((req, res) => documentController.update(req, res)));
router.delete("/:id", asyncHandler((req, res) => documentController.delete(req, res)));

router.get("/:id/versions", asyncHandler((req, res) => documentController.getDocumentVersions(req, res)));
router.post("/:id/versions", validate(createDocVersionSchema), asyncHandler((req, res) => documentController.addVersion(req, res)));
router.post("/:id/versions/:versionId/restore", asyncHandler((req, res) => documentController.restoreVersion(req, res)));

router.get("/:id/content", asyncHandler((req, res) => documentController.generateContent(req, res)));
router.post("/:id/generate", validate(generateDocSchema), asyncHandler((req, res) => documentController.generateAndSave(req, res)));

export default router;
