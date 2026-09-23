const API_BASE_URL = "http://localhost:3000";

export const apiClient = async (
    endpoint: string,
    options?: RequestInit
) => {
    const response = await fetch(
        `${API_BASE_URL}${endpoint}`,
        options
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || `API request failed: ${response.status}`
        );
    }

    return data;
};