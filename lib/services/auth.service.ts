import { prisma } from "@/lib/prisma";
import { hashPassword, comparePassword, generateToken } from "@/lib/auth";
import { ApiError } from "../errors/api-error";
import { OAuth2Client } from "google-auth-library";

// Constant-time dummy hash used for credential verification when no user is found.
const DUMMY_HASH = "$2b$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ012345";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export class AuthService {
    /**
     * Register a new user.
     */
    static async register(email: string, password: string) {
        const normalizedEmail = email.toLowerCase().trim();

        const existingUser = await prisma.user.findUnique({
            where: { email: normalizedEmail },
        });

        if (existingUser) {
            throw ApiError.conflict("An account with this email already exists.");
        }

        const hashedPassword = await hashPassword(password);

        const user = await prisma.user.create({
            data: {
                email: normalizedEmail,
                password: hashedPassword,
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
            },
        });

        return user;
    }

    /**
     * Log in an existing user with email and password.
     */
    static async login(email: string, password: string) {
        const normalizedEmail = email.toLowerCase().trim();

        const user = await prisma.user.findUnique({
            where: { email: normalizedEmail },
        });

        if (!user || !user.password) {
            // Execute dummy check to prevent timing attacks.
            await comparePassword(password, DUMMY_HASH);

            // If user exists but has no password, they likely signed up with Google.
            if (user && !user.password) {
                throw ApiError.unauthorized("This account was created with Google. Please sign in with Google.");
            }

            throw ApiError.unauthorized("Invalid email or password.");
        }

        const passwordMatch = await comparePassword(password, user.password);

        if (!passwordMatch) {
            throw ApiError.unauthorized("Invalid email or password.");
        }

        const token = generateToken({ userId: user.id, role: user.role });

        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                name: user.name,
            },
        };
    }

    /**
     * Google Login / Register.
     */
    static async googleLogin(idToken: string) {
        try {
            const ticket = await googleClient.verifyIdToken({
                idToken,
                audience: process.env.GOOGLE_CLIENT_ID,
            });

            const payload = ticket.getPayload();
            if (!payload || !payload.email) {
                throw ApiError.badRequest("Invalid Google token.");
            }

            const { sub: googleId, email, name } = payload;
            const normalizedEmail = email.toLowerCase().trim();

            // Upsert: Try to find by email or googleId
            let user = await prisma.user.findFirst({
                where: {
                    OR: [
                        { email: normalizedEmail },
                        { googleId },
                    ]
                },
            });

            if (!user) {
                // Register new Google user
                user = await prisma.user.create({
                    data: {
                        email: normalizedEmail,
                        googleId,
                        name: name || null,
                    },
                });
            } else if (!user.googleId) {
                // Link existing email to Google account
                user = await prisma.user.update({
                    where: { id: user.id },
                    data: { googleId, name: user.name || name },
                });
            }

            const token = generateToken({ userId: user.id, role: user.role });

            return {
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    name: user.name,
                },
            };
        } catch (error: any) {
            if (error instanceof ApiError) throw error;
            console.error("[GOOGLE AUTH ERROR]", error.message);
            throw ApiError.unauthorized("Google authentication failed.");
        }
    }
}
