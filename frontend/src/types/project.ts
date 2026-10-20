import type { Technology } from "./technology";

export type Project = {
    id: number;
    title: string;
    slug: string;
    description: string;
    imageUrl: string | null;
    githubUrl: string | null;
    liveUrl: string | null;
    featured: boolean;
    createdAt: string;
    updatedAt: string;
    images: ProjectImage[];
    technologies: Technology[];
};

export type CreateProject = {
    title: string;
    slug: string;
    description: string;
    imageUrl?: string;
    githubUrl?: string;
    liveUrl?: string;
    featured?: boolean;
    technologyIds?: number[];
};

export type UpdateProject = Partial<CreateProject>;

export type ProjectImage = {
    id: number;
    url: string;
    publicId: string;
};

