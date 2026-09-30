export type CreateProject = {
    title: string;
    slug: string;
    description: string;
    imageUrl?: string;
    githubUrl?: string;
    liveUrl?: string;
    featured?: boolean;
};

export type UpdateProject = Partial<CreateProject>;