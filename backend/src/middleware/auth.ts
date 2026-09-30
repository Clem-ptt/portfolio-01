import type { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/response.js";

export const requireAuth = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.session.userId) {
        sendError(res, "Authentication required", 401);
        return;
    }

    next();
};