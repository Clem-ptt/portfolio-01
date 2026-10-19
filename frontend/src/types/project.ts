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

export type ProjectImage = {
    id: number;
    url: string;
    publicId: string;
};