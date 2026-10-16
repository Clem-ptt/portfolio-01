import type { Request, Response, NextFunction } from "express";
import multer from "multer";
import { sendError } from "../utils/response.js";

export const uploadErrorHandler = (
    error: unknown,
    _req: Request,
    res: Response,
    next: NextFunction
) => {
    if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
            sendError(res, "Image must not exceed 10 MB", 413);
            return;
        }

        sendError(res, "Invalid image upload", 400);
        return;
    }

    if (
        error instanceof Error &&
        error.message ===
            "Only JPEG, PNG, and WebP images are allowed."
    ) {
        sendError(res, error.message, 400);
        return;
    }

    next(error);
};