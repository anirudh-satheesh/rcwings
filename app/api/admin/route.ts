import { NextRequest } from "next/server";
import { withErrorHandler } from "@/lib/utils/with-error-handler";
import { sendSuccess } from "@/lib/utils/api-response";
import { authenticate } from "@/lib/authenticate";
import { ApiError } from "@/lib/errors/api-error";

/**
 * GET /api/admin
 */
export const GET = withErrorHandler(async (req: NextRequest) => {
    const auth = authenticate(req);
    if (auth.error) return auth.error;

    // Role check
    if (auth.decoded.role !== "ADMIN") {
        throw ApiError.forbidden("Admin access required.");
    }

    return sendSuccess(
        {
            userId: auth.decoded.userId,
            role: auth.decoded.role,
        },
        "Welcome, Admin."
    );
});
