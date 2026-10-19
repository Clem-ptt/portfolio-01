import { prisma } from "../lib/prisma.js";
import { deleteUploadedImage } from "./upload.service.js";

type CreateProjectData = {
    title: string;
    slug: string;
    description: string;
    imageUrl?: string;
    githubUrl?: string;
    liveUrl?: string;
    featured?: boolean;
    technologyIds?: number[];
};

// #region Project Service

export const getProjects = async () => {
    return prisma.project.findMany({
        orderBy: {
            createdAt: "desc",
        },
        include: {
            technologies: true,
        },
    });
};

export const getFeaturedProjects = async () => {
    return prisma.project.findMany({
        where: {
            featured: true,
        },
        orderBy: {
            createdAt: "desc",
        },
        include: {
            technologies: true,
        },
    });
};

export const getProjectById = async (id: number) => {
    return prisma.project.findUnique({
        where: {
            id,
        },
        include: {
            technologies: true,
        },
    });
};

export const getProjectBySlug = async (slug: string) => {
    return prisma.project.findUnique({
        where: { slug },
        include: {
            technologies: true,
        },
    });
};

export const createProject = async (data: CreateProjectData) => {
    const { technologyIds, ...projectData } = data;

    return prisma.project.create({
        data: {
            ...projectData,
            ...(technologyIds !== undefined && {
                technologies: {
                    connect: technologyIds.map((id) => ({ id })),
                },
            }),
        },
        include: {
            technologies: true,
        },
    });
};

export const updateProject = async (
    id: number,
    data: Partial<CreateProjectData>
) => {
    const { technologyIds, ...projectData } = data;

    return prisma.project.update({
        where: {
            id,
        },
        data: {
            ...projectData,
            ...(technologyIds !== undefined && {
                technologies: {
                    set: technologyIds.map((technologyId) => ({
                        id: technologyId,
                    })),
                },
            }),
        },
        include: {
            technologies: true,
        },
    });
};

export const deleteProject = async (id: number) => {
    const project = await prisma.project.findUnique({
        where: { id },
        include: {
            images: {
                select: { publicId: true },
            },
        },
    });

    if (!project) {
        throw new Error("Project not found");
    }

    const results = await Promise.allSettled(
        project.images.map((image) =>
            deleteUploadedImage(image.publicId)
        )
    );

    const failedDeletions = results.some(
        (result) => result.status === "rejected"
    );

    if (failedDeletions) {
        throw new Error(
            "Some project images could not be deleted from Cloudinary"
        );
    }

    return prisma.project.delete({
        where: { id },
    });
};

// #endregion

// #region Project Image Service

export const createProjectImage = async (
    projectId: number,
    url: string,
    publicId: string
) => {
    return prisma.projectImage.create({
        data: {
            projectId,
            url,
            publicId,
        },
    });
};

export const getProjectImages = async (
    projectId: number
) => {
    return prisma.projectImage.findMany({
        where: { projectId },
        orderBy: { createdAt: "asc" },
    });
};

export const deleteProjectImage = async (
    projectId: number,
    imageId: number
) => {
    const image = await prisma.projectImage.findFirst({
        where: {
            id: imageId,
            projectId,
        },
    });

    if (!image) {
        throw new Error("Project image not found");
    }

    await deleteUploadedImage(image.publicId);

    return prisma.$transaction(async (tx) => {
        const project = await tx.project.findUnique({
            where: { id: projectId },
            select: { imageUrl: true },
        });

        const deletedImage = await tx.projectImage.delete({
            where: { id: imageId },
        });

        if (project?.imageUrl === image.url) {
            const replacement = await tx.projectImage.findFirst({
                where: { projectId },
                orderBy: { createdAt: "asc" },
            });

            await tx.project.update({
                where: { id: projectId },
                data: { imageUrl: replacement?.url ?? null },
            });
        }

        return deletedImage;
    });
};

export const setProjectMainImage = async (
    projectId: number,
    imageId: number
) => {
    const image = await prisma.projectImage.findFirst({
        where: {
            id: imageId,
            projectId,
        },
    });

    if (!image) {
        return null;
    }

    return prisma.project.update({
        where: { id: projectId },
        data: { imageUrl: image.url },
    });
};

// #endregion