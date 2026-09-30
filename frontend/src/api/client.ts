import type {
    ApiSuccessResponse,
    ApiErrorResponse,
} from "../types/api";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL;

export const apiClient = async <T>(
    endpoint: string,
    options?: RequestInit
): Promise<T> => {
    const response = await fetch(
        `${API_BASE_URL}${endpoint}`,
        {
            ...options,
            credentials: "include",
        }
    );

    let data:
        | ApiSuccessResponse<T>
        | ApiErrorResponse
        | null = null;

    try {
        data = await response.json();
    } catch {
        // Response was not valid JSON
    }

    if (!response.ok) {
        throw new Error(
            data && "message" in data
                ? data.message
                : `API request failed: ${response.status}`
        );
    }

    if (!data || !("data" in data)) {
        throw new Error("Invalid API response.");
    }

    return data.data;
};