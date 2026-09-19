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

export const getProjects = async () => {
    return prisma.project.findMany({
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