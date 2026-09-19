import { apiClient } from "./client";
import type { Project } from "../types/project";

export const getProjects = async (): Promise<Project[]> => {
    const response = await apiClient("/api/projects");

    return response.data;
};

export const getProjectBySlug = async (
    slug: string
): Promise<Project> => {
    const response = await apiClient(
        `/api/projects/slug/${slug}`
    );

    return response.data;
};