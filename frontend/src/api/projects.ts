import { apiClient } from "./client";
import type { Project } from "../types/project";
import type { CreateProject, UpdateProject } from "../types/createproject";

export const getProjects = async (): Promise<Project[]> => {
    return apiClient<Project[]>("/api/projects");
};

export const getFeaturedProjects = async (): Promise<Project[]> => {
    return apiClient<Project[]>("/api/projects/featured");
};

export const getProjectBySlug = async (
    slug: string
): Promise<Project> => {
    return apiClient<Project>(
        `/api/projects/slug/${slug}`
    );
};

export const createProject = async (
    data: CreateProject
): Promise<Project> => {
    return apiClient<Project>("/api/projects", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
};

export const updateProject = async (
    id: number,
    data: UpdateProject
): Promise<Project> => {
    return apiClient<Project>(`/api/projects/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
};

export const deleteProject = async (
    id: number
): Promise<Project> => {
    return apiClient<Project>(`/api/projects/${id}`, {
        method: "DELETE",
    });
};