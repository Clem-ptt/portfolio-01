import { z } from "zod";

const slugSchema = z
    .string()
    .min(1, "Slug is required")
    .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Slug must contain only lowercase letters, numbers, and hyphens"
    );

export const projectIdSchema = z.object({
  id: z.coerce.number().int().positive("ID must be a positive integer"),
});

export const projectSlugSchema = z.object({
    slug: slugSchema,
});

export const createProjectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: slugSchema,
  description: z.string().min(1, "Description is required"),

  imageUrl: z.url("Invalid image URL").optional(),
  githubUrl: z.url("Invalid GitHub URL").optional(),
  liveUrl: z.url("Invalid live URL").optional(),

  featured: z.boolean().optional(),
});

export const updateProjectSchema = createProjectSchema.partial();