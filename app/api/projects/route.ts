import { NextRequest } from "next/server";
import { withErrorHandler } from "@/lib/utils/with-error-handler";
import { sendSuccess } from "@/lib/utils/api-response";
import { authenticate } from "@/lib/authenticate";
import { projectCreateSchema, projectPaginationSchema } from "@/lib/validations/project.schema";
import { ProjectService } from "@/lib/services/project.service";
import { ApiError } from "@/lib/errors/api-error";

/**
 * GET /api/projects
 * Implements: Pagination, Filtering (by status), and Auth Protection.
 */
export const GET = withErrorHandler(async (req: NextRequest) => {
    const auth = authenticate(req);
    if (auth.error) return auth.error;

    // 1. Parse Query Params with Zod (Pagination/Filtering)
    const url = new URL(req.url);
    const queryParams = Object.fromEntries(url.searchParams.entries());
    const { page, limit, status } = projectPaginationSchema.parse(queryParams);

    // 2. Delegate to Service Layer
    const result = await ProjectService.listForUser({
        userId: auth.decoded.userId,
        page,
        limit,
        status,
    });

    // 3. Return Standardized Success with Metadata (Pagination info)
    return sendSuccess(result.data, "Projects fetched successfully.", 200, {
        page: result.page,
        limit,
        total: result.total,
        pages: result.pages,
    });
});

/**
 * POST /api/projects
 */
export const POST = withErrorHandler(async (req: NextRequest) => {
    const auth = authenticate(req);
    if (auth.error) return auth.error;

    const body = await req.json();
    const { title, description } = projectCreateSchema.parse(body);

    const project = await ProjectService.create({
        userId: auth.decoded.userId,
        title,
        description,
    });

    return sendSuccess(project, "Project created successfully.", 201);
});
