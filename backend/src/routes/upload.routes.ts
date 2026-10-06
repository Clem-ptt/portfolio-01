import { Router } from "express";
import { uploadProjectImage } from "../controllers/upload.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/authorize.js";
import { upload } from "../middleware/upload.js";
import { uploadErrorHandler } from "../middleware/upload-error.js";

const router = Router();

router.post(
    "/",
    requireAuth,
    requireRole("ADMIN"),
    upload.single("image"),
    uploadProjectImage,
    uploadErrorHandler
);

export default router;