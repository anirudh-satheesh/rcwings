import { z } from "zod";

export const projectCreateSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title is too long"),
    description: z.string().max(1000, "Description is too long").optional(),
});

export const projectUpdateSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title is too long").optional(),
    description: z.string().max(1000, "Description is too long").optional(),
    status: z.enum(["ACTIVE", "COMPLETED"]).optional(),
});

export const projectPaginationSchema = z.object({
    page: z.string().transform(Number).pipe(z.number().min(1)).optional().default(1),
    limit: z.string().transform(Number).pipe(z.number().min(1).max(100)).optional().default(10),
    status: z.enum(["ACTIVE", "COMPLETED"]).optional(),
});
