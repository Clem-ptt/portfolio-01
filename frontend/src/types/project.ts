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
};