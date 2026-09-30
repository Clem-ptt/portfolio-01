import type { Request, Response } from "express";
import { authenticateUser } from "../services/auth.service.js";
import { sendError, sendSuccess } from "../utils/response.js";

export const login = async (
    req: Request,
    res: Response
) => {
    const { email, password } = req.body;

    const user = await authenticateUser(email, password);

    if (!user) {
        sendError(res, "Invalid email or password", 401);
        return;
    }

    req.session.userId = user.id;
    req.session.role = user.role;

    sendSuccess(res, {
        id: user.id,
        email: user.email,
        role: user.role,
    });
};

export const logout = async (
    req: Request,
    res: Response
) => {
    req.session.destroy((error) => {
        if (error) {
            sendError(res, "Failed to log out", 500);
            return;
        }

        res.clearCookie("portfolio.sid", {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            path: "/",
        });

        sendSuccess(res, null);
    });
};

export const getCurrentUser = async (
    req: Request,
    res: Response
) => {
    res.set("Cache-Control", "no-store");

    if (!req.session.userId) {
        sendError(res, "Authentication required", 401);
        return;
    }

    sendSuccess(res, {
        id: req.session.userId,
        role: req.session.role,
    });
};