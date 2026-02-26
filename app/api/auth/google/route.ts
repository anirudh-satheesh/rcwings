import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "@/lib/utils/with-error-handler";
import { sendSuccess } from "@/lib/utils/api-response";
import { AuthService } from "@/lib/services/auth.service";
import { z } from "zod";

const googleAuthSchema = z.object({
    idToken: z.string().min(1, "Google ID token is required."),
});

/**
 * POST /api/auth/google
 * Handles Google Login credential verification.
 */
export const POST = withErrorHandler(async (req: NextRequest) => {
    const body = await req.json();

    // 1. Validate Input
    const { idToken } = googleAuthSchema.parse(body);

    // 2. Delegate to AuthService
    const result = await AuthService.googleLogin(idToken);

    // 3. Return Standardized Response
    return sendSuccess(result, "Google login successful.");
});
