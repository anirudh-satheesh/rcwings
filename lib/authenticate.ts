import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/verifyToken";
import type { TokenPayload } from "@/lib/auth";
import { sendError } from "./utils/api-response";

type AuthSuccess = { decoded: TokenPayload; error: null };
type AuthFailure = { decoded: null; error: NextResponse };
type AuthResult = AuthSuccess | AuthFailure;

/**
 * Parses the Authorization header, verifies the Bearer token,
 * and returns either the decoded payload or a ready-to-return error response.
 *
 * Refactored to use the standardized error response format.
 */
export function authenticate(req: NextRequest): AuthResult {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return {
            decoded: null,
            error: sendError("Unauthorized: No token provided.", 401),
        };
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = verifyToken(token);

        if (!decoded) {
            return {
                decoded: null,
                error: sendError("Unauthorized: Invalid or expired token.", 401),
            };
        }

        return { decoded, error: null };
    } catch (error: any) {
        // verifyToken throws if JWT_SECRET is missing. propagate as 500.
        return {
            decoded: null,
            error: sendError(error.message || "Internal server error during authentication.", 500),
        };
    }
}
