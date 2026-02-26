import { NextRequest } from "next/server";
import { withErrorHandler } from "@/lib/utils/with-error-handler";
import { sendSuccess } from "@/lib/utils/api-response";
import { authenticate } from "@/lib/authenticate";

/**
 * GET /api/protected
 */
export const GET = withErrorHandler(async (req: NextRequest) => {
    const auth = authenticate(req);
    if (auth.error) return auth.error;

    return sendSuccess(
        {
            userId: auth.decoded.userId,
            role: auth.decoded.role,
        },
        "Access granted."
    );
});
