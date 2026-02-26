import { NextRequest } from "next/server";
import { withErrorHandler } from "@/lib/utils/with-error-handler";
import { sendSuccess } from "@/lib/utils/api-response";
import { registerSchema } from "@/lib/validations/auth.schema";
import { AuthService } from "@/lib/services/auth.service";

/**
 * POST /api/auth/register
 * Refactored: Uses Clean Architecture + Zod Validation + Global Error Handling.
 */
export const POST = withErrorHandler(async (req: NextRequest) => {
    const body = await req.json();

    // 1. Validate Input
    const { email, password } = registerSchema.parse(body);

    // 2. Delegate to Service Layer
    const user = await AuthService.register(email, password);

    // 3. Send Standardized Success Response
    return sendSuccess(user, "Account created successfully.", 201);
});
