import type { Response } from "express";
import type {
    ApiSuccessResponse,
    ApiErrorResponse,
} from "../types/api.js";

export const sendSuccess = <T>(
    res: Response,
    data: T,
    statusCode = 200
) => {
    const response: ApiSuccessResponse<T> = {
        success: true,
        data,
    };

    return res.status(statusCode).json(response);
};

export const sendError = (
    res: Response,
    message: string,
    statusCode = 500,
    errors?: unknown
) => {
    const response: ApiErrorResponse = {
        success: false,
        message,
        ...(errors !== undefined && { errors }),
    };

    return res.status(statusCode).json(response);
};