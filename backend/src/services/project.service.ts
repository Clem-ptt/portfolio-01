import { prisma } from "../lib/prisma.js";

type CreateProjectData = {
    title: string;
    slug: string;
    description: string;
    imageUrl?: string;
    githubUrl?: string;
    liveUrl?: string;
    featured?: boolean;
};

// #region Project Service

export const getProjects = async () => {
    return prisma.project.findMany({
        orderBy: {
            createdAt: "desc",
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
    });
};

export const getProjectById = async (id: number) => {
    return prisma.project.findUnique({
        where: {
            id,
        },
    });
};

export const getProjectBySlug = async (slug: string) => {
    return prisma.project.findUnique({
        where: { slug },
    });
};

export const createProject = async (data: CreateProjectData) => {
    return prisma.project.create({
        data,
    });
};

export const updateProject = async (
    id: number,
    data: Partial<CreateProjectData>
) => {
    return prisma.project.update({
        where: {
            id,
        },
        data,
    });
};

export const deleteProject = async (
    id: number
) => {
    return prisma.project.delete({
        where: {
            id,
        },
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
    return prisma.projectImage.delete({
        where: {
            id: imageId,
            projectId,
        },
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
        throw new Error("Project image not found");
    }

    return prisma.project.update({
        where: { id: projectId },
        data: {
            imageUrl: image.url,
        },
    });
};

// #endregion