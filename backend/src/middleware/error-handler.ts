import type { Request, Response, NextFunction } from "express";
import { Prisma } from "../generated/prisma/client.js";
import { sendError } from "../utils/response.js";

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error(error);

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      sendError(res, "A project with this value already exists", 409);
      return;
    }

    if (error.code === "P2025") {
      sendError(res, "Project not found", 404);
      return;
    }
  }

  sendError(res, "Internal server error", 500);
};