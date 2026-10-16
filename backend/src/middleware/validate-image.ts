import { fileTypeFromBuffer } from "file-type";
import type { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/response.js";

const allowedImageTypes = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
]);

export const validateImageContent = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.file) {
        next();
        return;
    }

    try {
        const fileType = await fileTypeFromBuffer(req.file.buffer);

        if (!fileType || !allowedImageTypes.has(fileType.mime)) {
            sendError(
                res,
                "File contents must be a valid JPEG, PNG, or WebP image",
                400
            );
            return;
        }

        next();
    } catch (error) {
        next(error);
    }
};
