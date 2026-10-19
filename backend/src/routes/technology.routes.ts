import { Router } from "express";
import {
    getTechnologiesController,
    getTechnologyByIdController,
    createTechnologyController,
    updateTechnologyController,
    deleteTechnologyController,
} from "../controllers/technology.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/authorize.js";

const router = Router();

// Public routes
router.get("/", getTechnologiesController);
router.get("/:id", getTechnologyByIdController);

// Admin-only routes
router.post("/", requireAuth, requireRole("ADMIN"), createTechnologyController);
router.patch("/:id", requireAuth, requireRole("ADMIN"), updateTechnologyController);
router.delete("/:id", requireAuth, requireRole("ADMIN"), deleteTechnologyController);

export default router;
