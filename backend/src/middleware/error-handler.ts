import type { Request, Response, NextFunction } from "express";
import { Prisma } from "../generated/prisma/client.js";
import { sendError } from "../utils/response.js";
import { ZodError } from "zod";

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(error);

  if (res.headersSent) {
    next(error);
    return;
  }

  if (error instanceof ZodError) {
    sendError(res, "Invalid request data", 400);
    return;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      sendError(res, "A record with this value already exists", 409);
      return;
    }

    if (error.code === "P2025") {
      sendError(res, "Record not found", 404);
      return;
    }
  }
  
  sendError(
    res,
    error instanceof Error ? error.message : "Internal server error",
    500
  );
};