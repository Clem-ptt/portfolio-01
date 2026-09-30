import { Router } from "express";
import { validate } from "../middleware/validate.js";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/authorize.js";
import {
    createProjectSchema,
    updateProjectSchema,
    projectIdSchema,
    projectSlugSchema,
} from "../validators/project.validator.js";
import {
    createProjectController,
    getProjectsController,
    getFeaturedProjectsController,
    getProjectByIdController,
    getProjectBySlugController,
    updateProjectController,
    deleteProjectController,
} from "../controllers/project.controller.js";


const router = Router();

router.get(
    "/", 
    getProjectsController
);

router.get(
    "/slug/:slug", 
    validate(projectSlugSchema, "params"), 
    getProjectBySlugController
);

router.get(
    "/featured", 
    getFeaturedProjectsController
);

router.get(
    "/:id", 
    validate(projectIdSchema, "params"), 
    getProjectByIdController
);

router.post(
    "/",
    requireAuth,
    requireRole("ADMIN"),
    validate(createProjectSchema),
    createProjectController
);

router.patch(
    "/:id",
    requireAuth,
    requireRole("ADMIN"),
    validate(projectIdSchema, "params"),
    validate(updateProjectSchema),
    updateProjectController
);

router.delete(
    "/:id",
    requireAuth,
    requireRole("ADMIN"),
    validate(projectIdSchema, "params"),
    deleteProjectController
);

export default router;