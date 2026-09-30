import type { Request, Response, NextFunction } from "express";
import type { Role } from "../generated/prisma/client.js";
import { sendError } from "../utils/response.js";

export const requireRole = (role: Role) => {
    return (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        if (req.session.role !== role) {
            sendError(res, "Forbidden", 403);
            return;
        }

        next();
    };
};