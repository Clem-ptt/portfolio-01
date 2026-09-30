import { Router } from "express";
import {
    login,
    getCurrentUser,
    logout,
} from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.js";
import { requireAuth } from "../middleware/auth.js";
import { loginSchema } from "../validators/auth.validator.js";

const router = Router();

router.post(
    "/login",
    validate(loginSchema),
    login
);

router.post(
    "/logout",
    logout
);

router.get(
    "/me",
    requireAuth,
    getCurrentUser
);

export default router;