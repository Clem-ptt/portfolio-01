import { apiClient } from "./client";
import type { Project, ProjectImage } from "../types/project";
import type { CreateProject, UpdateProject } from "../types/project";

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

export const uploadProjectImage = async (
    projectId: number,
    image: File
): Promise<ProjectImage> => {
    const formData = new FormData();

    formData.append("projectId", String(projectId));
    formData.append("image", image);

    return apiClient<ProjectImage>(
        "/api/uploads", {
        method: "POST",
        body: formData,
    });
};

export const getProjectImages = async (
    projectId: number
): Promise<ProjectImage[]> => {
    return apiClient<ProjectImage[]>(
        `/api/projects/${projectId}/images`
    );
};

export const deleteProjectImage = async (
    projectId: number,
    imageId: number
): Promise<ProjectImage> => {
    return apiClient<ProjectImage>(
        `/api/projects/${projectId}/images/${imageId}`, {
        method: "DELETE",
    });
};

export const setProjectMainImage = async (
    projectId: number,
    imageId: number
): Promise<Project> => {
    return apiClient<Project>(
        `/api/projects/${projectId}/images/${imageId}/main`, {
        method: "PATCH",
    });
};