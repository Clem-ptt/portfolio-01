import { useEffect, useState } from "react";
import {
    getProjectImages,
    deleteProjectImage,
    uploadProjectImage,
    setProjectMainImage,
} from "../../api/projects";
import type { Project, ProjectImage } from "../../types/project";
import ConfirmDialog from "../ui/ConfirmDialog";
import Toast from "../ui/Toast";

type ProjectImageManagerProps = {
    project: Project;
    onClose: () => void;
    onProjectUpdated: (updatedProject: Project) => void;
};

const ProjectImageManager = ({
    project,
    onClose,
    onProjectUpdated,
}: ProjectImageManagerProps) => {
    const [images, setImages] = useState<ProjectImage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [deletingImageId, setDeletingImageId] = useState<number | null>(null);
    const [settingMainImageId, setSettingMainImageId] = useState<number | null>(null);
    const [mainImageUrl, setMainImageUrl] = useState(project.imageUrl);
    const [imageToDelete, setImageToDelete] = useState<number | null>(null);
    const [toast, setToast] = useState<{
        type: "success" | "error";
        message: string;
    } | null>(null);

    useEffect(() => {
        let cancelled = false;

        const loadImages = async () => {
            try {
                const data = await getProjectImages(project.id);

                if (!cancelled) {
                    setImages(data);
                }
            } catch (error) {
                if (!cancelled) {
                    console.error(
                        error instanceof Error
                            ? error.message
                            : "Failed to load project images."
                    );
                    setImages([]);
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        };

        void loadImages();

        return () => {
            cancelled = true;
        };
    }, [project.id]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                if (imageToDelete !== null) {
                    setImageToDelete(null);
                    return;
                }

                onClose();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [imageToDelete, onClose]);

    const handleDelete = async () => {
        if (imageToDelete === null) {
            return;
        }

        const imageId = imageToDelete;
        const deletedImage = images.find((image) => image.id === imageId);

        try {
            setDeletingImageId(imageId);
            setToast(null);

            await deleteProjectImage(project.id, imageId);

            const remainingImages = images.filter(
                (image) => image.id !== imageId
            );

            setImages(remainingImages);

            if (deletedImage?.url === mainImageUrl) {
                const replacementImage = remainingImages[0];
                const replacementUrl = replacementImage?.url ?? null;

                setMainImageUrl(replacementUrl);

                onProjectUpdated({
                    ...project,
                    imageUrl: replacementUrl,
                });

                setToast({
                    type: "success",
                    message: replacementImage
                        ? "Main image deleted. A replacement image is now displayed."
                        : "Main image deleted. No images remain for this project.",
                });
            } else {
                setToast({
                    type: "success",
                    message: "Image deleted successfully.",
                });
            }

            setImageToDelete(null);
        } catch (error) {
            setToast({
                type: "error",
                message:
                    error instanceof Error
                        ? error.message
                        : "Failed to delete image.",
            });

            setImageToDelete(null);
        } finally {
            setDeletingImageId(null);
        }
    };

    const handleUpload = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        try {
            setIsUploading(true);

            const image = await uploadProjectImage(project.id, file);

            setImages((current) => [...current, image]);
        } catch (error) {
            setToast({
                type: "error",
                message:
                    error instanceof Error
                        ? error.message
                        : "Failed to upload image."
            });
        } finally {
            setIsUploading(false);
            event.target.value = "";
        }
    };

    const handleSetMainImage = async (imageId: number) => {
        try {
            setSettingMainImageId(imageId);
            setToast(null);

            const updatedProject = await setProjectMainImage(
                project.id,
                imageId
            );

            setMainImageUrl(updatedProject.imageUrl);
            onProjectUpdated(updatedProject);

            setToast({
                type: "success",
                message: "Main image updated successfully.",
            });
        } catch (error) {
            setToast({
                type: "error",
                message:
                    error instanceof Error
                        ? error.message
                        : "Failed to set main image.",
            });
        } finally {
            setSettingMainImageId(null);
        }
    };

    return (
        <>
            <div
                className="admin-dialog-backdrop"
                role="presentation"
            >
                <section
                    className="admin-dialog image-manager-dialog"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="project-image-manager-title"
                >
                    <header className="admin-dialog-header">
                        <div>
                            <h2 id="project-image-manager-title">
                                Manage Images
                            </h2>
                            <p className="image-manager-project-title">
                                {project.title}
                            </p>
                        </div>
                    </header>

                    <section className="image-gallery-section">
                        <h3>Project Gallery</h3>

                        {isLoading && <p>Loading images...</p>}

                        {!isLoading && images.length === 0 && (
                            <div className="admin-empty-state">
                                <p>No images uploaded yet.</p>
                            </div>
                        )}

                        {!isLoading && images.length > 0 && (
                            <div className="image-manager-grid">
                                {images.map((image) => {
                                    const isMainImage =
                                        image.url === mainImageUrl;

                                    return (
                                        <article
                                            className="image-manager-card"
                                            key={image.id}
                                        >
                                            <img
                                                className="image-manager-preview"
                                                src={image.url}
                                                alt={`${project.title} project screenshot`}
                                                loading="lazy"
                                            />

                                            <div className="image-manager-card-content">
                                                {isMainImage ? (
                                                    <span className="image-main-badge">
                                                        Main Image
                                                    </span>
                                                ) : (
                                                    <button
                                                        className="image-manager-button"
                                                        type="button"
                                                        onClick={() =>
                                                            handleSetMainImage(image.id)
                                                        }
                                                        disabled={
                                                            settingMainImageId !== null ||
                                                            deletingImageId !== null ||
                                                            imageToDelete !== null
                                                        }
                                                    >
                                                        {settingMainImageId === image.id
                                                            ? "Setting..."
                                                            : "Set as Main"}
                                                    </button>
                                                )}

                                                <button
                                                    className="image-manager-button image-delete-button"
                                                    type="button"
                                                    onClick={() =>
                                                        setImageToDelete(image.id)
                                                    }
                                                    disabled={
                                                        deletingImageId !== null ||
                                                        settingMainImageId !== null ||
                                                        imageToDelete !== null
                                                    }
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        )}
                    </section>

                    <footer className="image-manager-footer">
                        <label
                            className={`image-upload-button${isUploading ? " is-uploading" : ""}`}
                        >
                            {isUploading ? "Uploading..." : "Upload Image"}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleUpload}
                                disabled={
                                    isUploading ||
                                    deletingImageId !== null ||
                                    settingMainImageId !== null ||
                                    imageToDelete !== null
                                }
                            />
                        </label>

                        <button
                            className="admin-secondary-button"
                            type="button"
                            onClick={onClose}
                            disabled={imageToDelete !== null}
                        >
                            Close
                        </button>
                    </footer>
                </section>
            </div>

            {imageToDelete !== null && (
                <ConfirmDialog
                    title="Delete Image?"
                    message="Are you sure you want to delete this image? If it is the main image, the next available image will become the main image."
                    isLoading={deletingImageId !== null}
                    onConfirm={() => void handleDelete()}
                    onCancel={() => {
                        if (deletingImageId === null) {
                            setImageToDelete(null);
                        }
                    }}
                />
            )}

            {toast && (
                <Toast
                    type={toast.type}
                    message={toast.message}
                    onClose={() => setToast(null)}
                />
            )}
        </>
    );
};

export default ProjectImageManager;