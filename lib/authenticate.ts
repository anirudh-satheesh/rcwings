import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/verifyToken";
import type { TokenPayload } from "@/lib/auth";

type AuthSuccess = { decoded: TokenPayload; error: null };
type AuthFailure = { decoded: null; error: NextResponse };
type AuthResult = AuthSuccess | AuthFailure;

/**
 * Parses the Authorization header, verifies the Bearer token,
 * and returns either the decoded payload or a ready-to-return error response.
 *
 * Usage:
 *   const auth = authenticate(req);
 *   if (auth.error) return auth.error;
 *   const { decoded } = auth;
 */
export function authenticate(req: NextRequest): AuthResult {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return {
            decoded: null,
            error: NextResponse.json(
                { message: "Unauthorized: No token provided." },
                { status: 401 }
            ),
        };
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    if (!decoded) {
        return {
            decoded: null,
            error: NextResponse.json(
                { message: "Unauthorized: Invalid or expired token." },
                { status: 401 }
            ),
        };
    }

    return { decoded, error: null };
}
