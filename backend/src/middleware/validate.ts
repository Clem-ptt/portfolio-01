import type { Request, Response, NextFunction } from "express";
import type { ZodType } from "zod";

export const validate = (
  schema: ZodType,
  source: "body" | "params" | "query" = "body"
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: result.error.issues,
      });

      return;
    }

    req[source] = result.data;

    next();
  };
};