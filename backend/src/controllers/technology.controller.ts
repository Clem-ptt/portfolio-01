import type { Request, Response, NextFunction } from "express";
import {
    getTechnologies,
    getTechnologyById,
    createTechnology,
    updateTechnology,
    deleteTechnology,
} from "../services/technology.service.js";
import { sendSuccess, sendError } from "../utils/response.js";

const parseId = (value: string | string[] | undefined): number | null => {
    if (!value) {
        return null;
    }

    const id = Number(value);

    if (!Number.isSafeInteger(id) || id <= 0) {
        return null;
    }

    return id;
};

// #region Technology Controllers

export const getTechnologiesController = async (
    _req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const technologies = await getTechnologies();

        sendSuccess(res, technologies);
    } catch (error) {
        next(error);
    }
};

export const getTechnologyByIdController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const id = parseId(req.params.id);

        if (id === null) {
            sendError(res, "Invalid technology ID", 400);
            return;
        }

        const technology = await getTechnologyById(id);

        if (!technology) {
            sendError(res, "Technology not found", 404);
            return;
        }

        sendSuccess(res, technology);
    } catch (error) {
        next(error);
    }
};

export const createTechnologyController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const technology = await createTechnology(req.body);

        sendSuccess(res, technology, 201);
    } catch (error) {
        next(error);
    }
};

export const updateTechnologyController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const id = parseId(req.params.id);

        if (id === null) {
            sendError(res, "Invalid technology ID", 400);
            return;
        }

        const technology = await updateTechnology(id, req.body);

        sendSuccess(res, technology);
    } catch (error) {
        next(error);
    }
};

export const deleteTechnologyController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const id = parseId(req.params.id);

        if (id === null) {
            sendError(res, "Invalid technology ID", 400);
            return;
        }

        const technology = await deleteTechnology(id);

        sendSuccess(res, technology);
    } catch (error) {
        next(error);
    }
};

// #endregion