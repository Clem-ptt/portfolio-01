import multer from "multer";

const storage = multer.memoryStorage();

const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
];

export const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
    fileFilter: (_req, file, callback) => {
        if (!allowedMimeTypes.includes(file.mimetype)) {
            callback(
                new Error(
                    "Only JPEG, PNG, and WebP images are allowed."
                )
            );
            return;
        }

        callback(null, true);
    },
});