import { z } from "zod";
import { TechnologyCategory } from "../generated/prisma/enums.js";

export const createTechnologySchema = z.object({
    name: z.string().trim().min(1, "Technology name is required"),
    iconUrl: z.string().url("Icon URL must be valid").optional(),
    category: z.nativeEnum(TechnologyCategory),
});

export const updateTechnologySchema = createTechnologySchema
    .partial()
    .refine(
        (data) => Object.values(data).some((value) => value !== undefined),
        "At least one field must be provided"
    );