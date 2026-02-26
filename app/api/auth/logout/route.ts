import { NextResponse } from "next/server";
import { withErrorHandler } from "@/lib/utils/with-error-handler";
import { sendSuccess } from "@/lib/utils/api-response";

/**
 * POST /api/auth/logout
 * Clears the authentication cookie.
 */
export const POST = withErrorHandler(async () => {
    const res = sendSuccess(null, "Logged out successfully.");

    res.cookies.set("token", "", {
        httpOnly: true,
        expires: new Date(0),
        path: "/",
    });

    return res;
});
