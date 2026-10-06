import { useEffect, useState } from "react";
import {
    getProjectImages,
    deleteProjectImage,
    uploadProjectImage,
    setProjectMainImage,
} from "../../api/projects";
import type { Project, ProjectImage } from "../../types/project";

type ProjectImageManagerProps = {
    project: Project;
    onClose: () => void;
};

const ProjectImageManager = ({
    project,
    onClose,
}: ProjectImageManagerProps) => {
    const [images, setImages] = useState<ProjectImage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [deletingImageId, setDeletingImageId] =
        useState<number | null>(null);
    const [error, setError] = useState("");
    const [settingMainImageId, setSettingMainImageId] =
        useState<number | null>(null);
    const [mainImageUrl, setMainImageUrl] = 
        useState(project.imageUrl);

    useEffect(() => {
        const loadImages = async () => {
            try {
                setError("");

                const data = await getProjectImages(project.id);
                setImages(data);
            } catch (error) {
                setError(
                    error instanceof Error
                        ? error.message
                        : "Failed to load project images."
                );
            } finally {
                setIsLoading(false);
            }
        };

        loadImages();
    }, [project.id]);

    const handleDelete = async (imageId: number) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this image?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeletingImageId(imageId);
            setError("");

            await deleteProjectImage(
                project.id,
                imageId
            );

            setImages((current) =>
                current.filter(
                    (image) => image.id !== imageId
                )
            );
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to delete image."
            );
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
            setError("");

            const image = await uploadProjectImage(
                project.id,
                file
            );

            setImages((current) => [
                ...current,
                image,
            ]);
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to upload image."
            );
        } finally {
            setIsUploading(false);
            event.target.value = "";
        }
    };

    const handleSetMainImage = async (imageId: number) => {
        try {
            setSettingMainImageId(imageId);
            setError("");

            const updatedProject = await setProjectMainImage(
                project.id,
                imageId
            );

            setMainImageUrl(updatedProject.imageUrl);
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to set main image."
            );
        } finally {
            setSettingMainImageId(null);
        }
    };

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-image-manager-title"
        >
            <div>
                <h2 id="project-image-manager-title">
                    {project.title} Images
                </h2>

                {isLoading && (
                    <p>Loading images...</p>
                )}

                {error && <p>{error}</p>}

                {!isLoading && images.length === 0 && (
                    <p>No images uploaded.</p>
                )}

                <div>
                    <label htmlFor="project-image">
                        Add Image
                    </label>

                    <input
                        id="project-image"
                        type="file"
                        accept="image/*"
                        onChange={handleUpload}
                        disabled={isUploading}
                    />

                    {isUploading && <p>Uploading...</p>}
                </div>

                {!isLoading && images.length > 0 && (
                    <div>
                        {images.map((image) => (
                            <div key={image.id}>
                                <img
                                    src={image.url}
                                    alt={`${project.title} image`}
                                    width="150"
                                />

                                {image.url === mainImageUrl ? (
                                    <span>Main Image</span>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => handleSetMainImage(image.id)}
                                        disabled={settingMainImageId === image.id}
                                    >
                                        {settingMainImageId === image.id
                                            ? "Setting..."
                                            : "Set as Main"}
                                    </button>
                                )}

                                <button
                                    type="button"
                                    onClick={() =>
                                        handleDelete(image.id)
                                    }
                                    disabled={
                                        deletingImageId === image.id
                                    }
                                >
                                    {deletingImageId === image.id
                                        ? "Deleting..."
                                        : "Delete"}
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <button
                    type="button"
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default ProjectImageManager;