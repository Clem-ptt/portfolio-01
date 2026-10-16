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

const wait = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

const deleteImageOnce = (publicId: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.destroy(
            publicId,
            { resource_type: "image" },
            (error, result) => {
                if (error) {
                    reject(error);
                    return;
                }

                if (
                    result?.result !== "ok" &&
                    result?.result !== "not found"
                ) {
                    reject(
                        new Error("Cloudinary image deletion failed.")
                    );
                    return;
                }

                resolve();
            }
        );
    });
};

export const deleteUploadedImage = async (
    publicId: string
): Promise<void> => {
    const maxAttempts = 3;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            await deleteImageOnce(publicId);
            return;
        } catch (error) {
            if (attempt === maxAttempts) {
                throw error;
            }

            await wait(500 * attempt);
        }
    }
};