import jwt from "jsonwebtoken";
import type { TokenPayload } from "./auth";

/**
 * Verifies a JWT and returns the decoded payload, or null if invalid/expired.
 */
export function verifyToken(token: string): TokenPayload | null {
    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error("JWT_SECRET environment variable is not defined.");
        }
        const decoded = jwt.verify(token, secret) as TokenPayload;
        return decoded;
    } catch {
        return null;
    }
}
