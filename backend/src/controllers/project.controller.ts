import type { Request, Response, NextFunction } from "express";
import {
    createProject,
    updateProject,
    deleteProject,
    getProjects,
    getProjectById,
} from "../services/project.service.js";
import { sendSuccess } from "../utils/response.js";

export const getProjectsController = async (
    _req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const projects = await getProjects();

        sendSuccess(res, projects);
    } catch (error) {
        next(error);
    }
};

export const getProjectByIdController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const id = Number(req.params.id);

        const project = await getProjectById(id);

        if (!project) {
            res.status(404).json({
                success: false,
                message: "Project not found",
            });
            return;
        }

        sendSuccess(res, project);
    } catch (error) {
        next(error);
    }
};

export const createProjectController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const project = await createProject(req.body);

        sendSuccess(res, project, 201);
    } catch (error) {
        next(error);
    }
};

export const updateProjectController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const id = Number(req.params.id);

        const project = await updateProject(id, req.body);

        sendSuccess(res, project);
    } catch (error) {
        next(error);
    }
};

export const deleteProjectController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const id = Number(req.params.id);

        const project = await deleteProject(id);

        sendSuccess(res, project);
    } catch (error) {
        next(error);
    }
};
