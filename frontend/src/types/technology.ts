export type TechnologyCategory =
    | "PROGRAMMING_LANGUAGES"
    | "FRONTEND"
    | "BACKEND"
    | "DATABASE"
    | "CLOUD_DEVOPS"
    | "TOOLS"
    | "AI_AUTOMATION"
    | "SECURITY_INFRASTRUCTURE"
    | "DESIGN"
    | "TESTING_QA"
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