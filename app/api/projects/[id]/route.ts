import { NextRequest } from "next/server";
import { withErrorHandler } from "@/lib/utils/with-error-handler";
import { sendSuccess } from "@/lib/utils/api-response";
import { authenticate } from "@/lib/authenticate";
import { projectUpdateSchema } from "@/lib/validations/project.schema";
import { ProjectService } from "@/lib/services/project.service";
import { ApiError } from "@/lib/errors/api-error";

interface RouteParams {
    params: Promise<{ id: string }>;
}

/**
 * PUT /api/projects/:id
 */
export const PUT = withErrorHandler(async (req: NextRequest, { params }: RouteParams) => {
    const auth = authenticate(req);
    if (auth.error) return auth.error;

    const { id } = await params;
    const body = await req.json();

    // 1. Zod Validation
    const validatedData = projectUpdateSchema.parse(body);


    // 3. Update via Service
    const updatedProject = await ProjectService.update({
        id,
        userId: auth.decoded.userId,
        ...validatedData,
    });

    return sendSuccess(updatedProject, "Project updated successfully.");
});

/**
 * DELETE /api/projects/:id
 */
export const DELETE = withErrorHandler(async (req: NextRequest, { params }: RouteParams) => {
    const auth = authenticate(req);
    if (auth.error) return auth.error;

    const { id } = await params;


    // 2. Delete via Service
    await ProjectService.delete(id, auth.decoded.userId);

    return sendSuccess(null, "Project deleted successfully.");
});
