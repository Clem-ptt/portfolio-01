const API_BASE_URL = "http://localhost:3000";

export const apiClient = async (
    endpoint: string,
    options?: RequestInit
) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

    if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
    }

    return response.json();
};