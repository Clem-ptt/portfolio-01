import type { Request, Response } from "express";
import { sendError, sendSuccess } from "../utils/response.js";
import {
    uploadImage,
    deleteUploadedImage,
} from "../services/upload.service.js";
import { createProjectImage } from "../services/project.service.js";

export const uploadProjectImage = async (
    req: Request,
    res: Response
) => {
    if (!req.file) {
        sendError(res, "Image file is required", 400);
        return;
    }

    const projectId = Number(req.body.projectId);

    if (!Number.isInteger(projectId) || projectId <= 0) {
        sendError(res, "Valid project ID is required", 400);
        return;
    }

    let publicId: string | undefined;

    try {
        const result = await uploadImage(
            req.file.buffer,
            req.file.originalname
        );

        publicId = result.public_id;

        const projectImage = await createProjectImage(
            projectId,
            result.secure_url,
            result.public_id
        );

        sendSuccess(res, {
            id: projectImage.id,
            url: projectImage.url,
            publicId: projectImage.publicId,
        });
    } catch (error) {
        if (publicId) {
            try {
                await deleteUploadedImage(publicId);
            } catch (cleanupError) {
                console.error(
                    "Failed to clean up Cloudinary image:",
                    cleanupError
                );
            }
        }

        console.error("Image upload failed:", error);
        sendError(res, "Failed to upload image", 500);
    }
};