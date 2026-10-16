import type { Request, Response, NextFunction } from "express";
import {
    createProject,
    updateProject,
    deleteProject,
    getProjects,
    getFeaturedProjects,
    getProjectById,
    getProjectBySlug,
    getProjectImages,
    deleteProjectImage,
    setProjectMainImage,
} from "../services/project.service.js";
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


// #region Project Controllers

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

export const getFeaturedProjectsController = async (
    _req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const projects = await getFeaturedProjects();

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
        const id = parseId(req.params.id);
        
        if (id === null) {
            sendError(res, "Invalid project ID", 400);
            return;
        }

        const project = await getProjectById(id);

        if (!project) {
            sendError(res, "Project not found", 404);
            return;
        }

        sendSuccess(res, project);
    } catch (error) {
        next(error);
    }
};

export const getProjectBySlugController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const slug = req.params.slug;

        if (typeof slug !== "string") {
            sendError(res, "Slug is required", 400);
            return;
        }

        const project = await getProjectBySlug(slug);

        if (!project) {
            sendError(res, "Project not found", 404);
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
        const id = parseId(req.params.id);

        if (id === null) {
            sendError(res, "Invalid project ID", 400);
            return;
        }

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
        const id = parseId(req.params.id);

        if (id === null) {
            sendError(res, "Invalid project ID", 400);
            return;
        }

        const project = await deleteProject(id);

        sendSuccess(res, project);
    } catch (error) {
        next(error);
    }
};

// #endregion


// #region Project Image Controllers

export const getProjectImagesController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const projectId = parseId(req.params.id);

        if (projectId === null) {
            sendError(res, "Invalid project ID", 400);
            return;
        }

        const project = await getProjectById(projectId);

        if (!project) {
            sendError(res, "Project not found", 404);
            return;
        }

        const images = await getProjectImages(projectId);

        sendSuccess(res, images);
    } catch (error) {
        next(error);
    }
};

export const deleteProjectImageController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const projectId = parseId(req.params.projectId);
        
        if (projectId === null) {
            sendError(res, "Invalid project ID", 400);
            return;
        }
        
        const imageId = parseId(req.params.imageId);

        if(imageId === null){
            sendError(res, "Invalid image ID", 400);
            return;
        }

        const image = await deleteProjectImage(
            projectId,
            imageId
        );

        sendSuccess(res, image);
    } catch (error) {
        next(error);
    }
};

export const setProjectMainImageController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const projectId = parseId(req.params.projectId);
        
        if (projectId === null) {
            sendError(res, "Invalid project ID", 400);
            return;
        }
        
        const imageId = parseId(req.params.imageId);

        if(imageId === null){
            sendError(res, "Invalid image ID", 400);
            return;
        }

        const project = await setProjectMainImage(
            projectId,
            imageId
        );

        if (!project) {
            sendError(res, "Project image not found", 404);
            return;
        }

        sendSuccess(res, project);
    } catch (error) {
        next(error);
    }
};

// #endregion