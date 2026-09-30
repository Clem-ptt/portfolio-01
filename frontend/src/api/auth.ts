import { apiClient } from "./client";

export type LoginData = {
    email: string;
    password: string;
};

export type AuthUser = {
    id: number;
    role: "ADMIN";
};

export const login = async (
    data: LoginData
): Promise<AuthUser> => {
    return apiClient<AuthUser>("/api/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
};

export const logout = async (): Promise<null> => {
    return apiClient<null>("/api/auth/logout", {
        method: "POST",
    });
};

export const getCurrentUser = async (): Promise<AuthUser> => {
    return apiClient<AuthUser>("/api/auth/me");
};