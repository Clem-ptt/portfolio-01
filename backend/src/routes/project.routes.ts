import { Router } from "express";
import { validate } from "../middleware/validate.js";
import {
    createProjectSchema,
    updateProjectSchema,
    projectIdSchema,
} from "../validators/project.validator.js";
import {
    createProjectController,
    getProjectsController,
    getProjectByIdController,
    updateProjectController,
    deleteProjectController,
} from "../controllers/project.controller.js";

const router = Router();

router.get("/", getProjectsController);
router.get("/:id", validate(projectIdSchema, "params"), getProjectByIdController);
router.post("/", validate(createProjectSchema), createProjectController);
router.put("/:id", validate(projectIdSchema, "params"), validate(updateProjectSchema), updateProjectController);
router.delete("/:id", validate(projectIdSchema, "params"), deleteProjectController);

export default router;