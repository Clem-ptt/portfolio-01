import { Router } from "express";
import { uploadProjectImage } from "../controllers/upload.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/authorize.js";
import { upload } from "../middleware/upload.js";
import { uploadErrorHandler } from "../middleware/upload-error.js";
import { validateImageContent } from "../middleware/validate-image.js";

const router = Router();

router.post(
    "/",
    requireAuth,
    requireRole("ADMIN"),
    upload.single("image"),
    validateImageContent,
    uploadProjectImage
);

router.use(uploadErrorHandler);

export default router;