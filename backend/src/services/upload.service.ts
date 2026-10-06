import type { UploadApiResponse } from "cloudinary";
import cloudinary from "../config/cloudinary.js";

export const uploadImage = (
    buffer: Buffer,
    filename: string
): Promise<UploadApiResponse> => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: "portfolio/projects",
                resource_type: "image",
                use_filename: true,
                unique_filename: true,
            },
            (error, result) => {
                if (error) {
                    reject(error);
                    return;
                }

                if (!result) {
                    reject(new Error("Cloudinary upload failed."));
                    return;
                }

                resolve(result);
            }
        );

        uploadStream.end(buffer);
    });
};