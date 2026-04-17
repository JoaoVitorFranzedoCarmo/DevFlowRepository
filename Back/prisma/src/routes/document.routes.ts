import { Router } from "express";
import { documentController } from "../controllers/document.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  createDocumentSchema,
  updateDocumentSchema,
  createDocVersionSchema,
} from "../validators/document.validator";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.use(authMiddleware);

// Stats
router.get("/stats", asyncHandler((req, res) => documentController.getStats(req, res)));

// Version history (all docs)
router.get("/versions", asyncHandler((req, res) => documentController.getVersionHistory(req, res)));

// CRUD
router.get("/", asyncHandler((req, res) => documentController.findAll(req, res)));
router.get("/:id", asyncHandler((req, res) => documentController.findById(req, res)));
router.post("/", validate(createDocumentSchema), asyncHandler((req, res) => documentController.create(req, res)));
router.put("/:id", validate(updateDocumentSchema), asyncHandler((req, res) => documentController.update(req, res)));
router.delete("/:id", asyncHandler((req, res) => documentController.delete(req, res)));

// Document versions
router.post("/:id/versions", validate(createDocVersionSchema), asyncHandler((req, res) => documentController.addVersion(req, res)));

// Strategy: geração de conteúdo — GET /documents/:id/content?format=HTML|PDF
router.get("/:id/content", asyncHandler((req, res) => documentController.generateContent(req, res)));

export default router;
