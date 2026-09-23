import { apiClient } from "./client";
import type { Project } from "../types/project";

export const getProjects = async (): Promise<Project[]> => {
    return apiClient<Project[]>("/api/projects");
};

export const getProjectBySlug = async (
    slug: string
): Promise<Project> => {
    return apiClient<Project>(
        `/api/projects/slug/${slug}`
    );
};