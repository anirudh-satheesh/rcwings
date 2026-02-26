import { prisma } from "@/lib/prisma";
import { ProjectStatus } from "@prisma/client";

export class ProjectService {
    /**
     * List projects with pagination and filtering.
     */
    static async listForUser(params: {
        userId: string;
        page: number;
        limit: number;
        status?: ProjectStatus;
    }) {
        const { userId, page, limit, status } = params;
        const skip = (page - 1) * limit;

        const where: any = { userId };
        if (status) where.status = status;

        const [projects, total] = await Promise.all([
            prisma.project.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
            }),
            prisma.project.count({ where }),
        ]);

        const pages = Math.ceil(total / limit);

        return {
            data: projects,
            total,
            page,
            pages,
        };
    }

    /**
     * Create a new project.
     */
    static async create(params: {
        userId: string;
        title: string;
        description?: string;
    }) {
        return prisma.project.create({
            data: {
                userId: params.userId,
                title: params.title,
                description: params.description || "",
            },
        });
    }

    /**
     * Find a project by ID and ensure it belongs to the user or is accessible.
     */
    static async findById(id: string, userId: string) {
        return prisma.project.findFirst({
            where: {
                id,
                userId,
            },
        });
    }

    /**
     * Update an existing project.
     */
    static async update(params: {
        id: string;
        userId: string;
        title?: string;
        description?: string;
        status?: ProjectStatus;
    }) {
        return prisma.project.update({
            where: { id: params.id },
            data: {
                title: params.title,
                description: params.description,
                status: params.status,
            },
        });
    }

    /**
     * Delete a project.
     */
    static async delete(id: string) {
        return prisma.project.delete({
            where: { id },
        });
    }
}
