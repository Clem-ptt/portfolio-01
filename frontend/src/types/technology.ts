export type TechnologyCategory =
    | "FRONTEND"
    | "BACKEND"
    | "DATABASE"
    | "DEVOPS"
    | "TOOLS"
    | "OTHER";

export type Technology = {
    id: number;
    name: string;
    iconUrl: string | null;
    category: TechnologyCategory;
};

export type CreateTechnology = {
    name: string;
    iconUrl?: string;
    category: TechnologyCategory;
};

export type UpdateTechnology = Partial<CreateTechnology>;