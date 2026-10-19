import { apiClient } from "./client";
import type { Technology } from "../types/technology";
import type {
    CreateTechnology,
    UpdateTechnology,
} from "../types/technology";

export const getTechnologies = async (): Promise<Technology[]> => {
    return apiClient<Technology[]>("/api/technologies");
};

export const getTechnologyById = async (
    id: number
): Promise<Technology> => {
    return apiClient<Technology>(`/api/technologies/${id}`);
};

export const createTechnology = async (
    data: CreateTechnology
): Promise<Technology> => {
    return apiClient<Technology>("/api/technologies", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
};

export const updateTechnology = async (
    id: number,
    data: UpdateTechnology
): Promise<Technology> => {
    return apiClient<Technology>(`/api/technologies/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
};

export const deleteTechnology = async (
    id: number
): Promise<Technology> => {
    return apiClient<Technology>(`/api/technologies/${id}`, {
        method: "DELETE",
    });
};
