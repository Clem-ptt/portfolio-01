import { prisma } from "../lib/prisma.js";
import { TechnologyCategory } from "../generated/prisma/enums.js";

type CreateTechnologyData = {
    name: string;
    iconUrl?: string;
    category: TechnologyCategory;
};

// #region Technology Service

export const getTechnologies = async () => {
    return prisma.technology.findMany({
        orderBy: {
            name: "asc",
        },
    });
};

export const getTechnologyById = async (id: number) => {
    return prisma.technology.findUnique({
        where: { id },
        include: {
            projects: {
                select: {
                    id: true,
                    title: true,
                    slug: true,
                },
            },
        },
    });
};

export const createTechnology = async (
    data: CreateTechnologyData
) => {
    return prisma.technology.create({
        data,
    });
};

export const updateTechnology = async (
    id: number,
    data: Partial<CreateTechnologyData>
) => {
    return prisma.technology.update({
        where: { id },
        data,
    });
};

export const deleteTechnology = async (id: number) => {
    const technology = await prisma.technology.findUnique({
        where: { id },
        select: {
            id: true,
            _count: {
                select: {
                    projects: true,
                },
            },
        },
    });

    if (!technology) {
        throw new Error("Technology not found");
    }

    if (technology._count.projects > 0) {
        throw new Error(
            "Cannot delete technology that is linked to projects"
        );
    }

    return prisma.technology.delete({
        where: { id },
    });
};

// #endregion
