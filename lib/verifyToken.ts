import jwt, { JwtPayload } from "jsonwebtoken";
import type { TokenPayload } from "./auth";

/**
 * Verifies a JWT and returns the decoded TokenPayload, or null for any
 * token-level error (expired, tampered, malformed, missing fields).
 *
 * A missing JWT_SECRET is NOT silenced — it throws immediately so deployment
 * misconfiguration surfaces as a 500 rather than a silent 401.
 */
export function verifyToken(token: string): TokenPayload | null {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        // Configuration error — propagate so the caller returns 500.
        throw new Error("JWT_SECRET environment variable is not defined.");
    }

    try {
        const decoded = jwt.verify(token, secret);

        // Runtime validation: ensure the payload is an object with the
        // expected string fields before narrowing the type.
        if (
            typeof decoded !== "object" ||
            decoded === null ||
            typeof (decoded as JwtPayload).userId !== "string" ||
            typeof (decoded as JwtPayload).role !== "string"
        ) {
            return null;
        }

        return decoded as TokenPayload;
    } catch {
        // Covers TokenExpiredError, JsonWebTokenError, NotBeforeError, etc.
        return null;
    }
}
