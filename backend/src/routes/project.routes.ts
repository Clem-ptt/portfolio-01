import { Router } from "express";
import { validate } from "../middleware/validate.js";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/authorize.js";
import {
    createProjectSchema,
    updateProjectSchema,
    projectIdSchema,
    projectSlugSchema,
    projectImageParamsSchema,
} from "../validators/project.validator.js";
import {
    createProjectController,
    getProjectsController,
    getFeaturedProjectsController,
    getProjectByIdController,
    getProjectBySlugController,
    updateProjectController,
    deleteProjectController,
    getProjectImagesController,
    deleteProjectImageController,
    setProjectMainImageController,
} from "../controllers/project.controller.js";


const router = Router();

router.get(
    "/",
    getProjectsController
);

router.get(
    "/featured",
    getFeaturedProjectsController
);

router.get(
    "/slug/:slug",
    validate(projectSlugSchema, "params"),
    getProjectBySlugController
);

router.get(
    "/:id/images",
    validate(projectIdSchema, "params"),
    getProjectImagesController
);

router.patch(
    "/:projectId/images/:imageId/main",
    requireAuth,
    requireRole("ADMIN"),
    validate(projectImageParamsSchema, "params"),
    setProjectMainImageController
);

router.delete(
    "/:projectId/images/:imageId",
    requireAuth,
    requireRole("ADMIN"),
    deleteProjectImageController
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