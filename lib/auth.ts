import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SALT_ROUNDS = 10;
const JWT_EXPIRES_IN = "7d";

export interface TokenPayload {
    userId: string;
    role: string;
}

/**
 * Hash a plain-text password using bcrypt.
 */
export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compare a plain-text password against a bcrypt hash.
 */
export async function comparePassword(
    password: string,
    hashedPassword: string
): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
}

/**
 * Generate a signed JWT containing userId and role.
 */
export function generateToken(payload: TokenPayload): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET environment variable is not defined.");
    }
    return jwt.sign(payload, secret, { expiresIn: JWT_EXPIRES_IN });
}
