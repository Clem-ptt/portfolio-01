import { z } from "zod";

export const projectIdSchema = z.object({
  id: z.coerce.number().int().positive("ID must be a positive integer"),
});

export const createProjectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(1, "Description is required"),

  imageUrl: z.url("Invalid image URL").optional(),
  githubUrl: z.url("Invalid GitHub URL").optional(),
  liveUrl: z.url("Invalid live URL").optional(),

  featured: z.boolean().optional(),
});

export const updateProjectSchema = createProjectSchema.partial();