import { NextRequest } from "next/server";
import { withErrorHandler } from "@/lib/utils/with-error-handler";
import { sendSuccess } from "@/lib/utils/api-response";
import { loginSchema } from "@/lib/validations/auth.schema";
import { AuthService } from "@/lib/services/auth.service";

/**
 * POST /api/auth/login
 * Refactored: Thin controller using Zod + AuthService + Global Error Handling.
 */
export const POST = withErrorHandler(async (req: NextRequest) => {
    const body = await req.json();

    // 1. Validate Input
    const { email, password } = loginSchema.parse(body);

    // 2. Delegate Login Logic to Service
    const result = await AuthService.login(email, password);

    // 3. Send Success Response
    return sendSuccess(result, "Login successful.");
});
