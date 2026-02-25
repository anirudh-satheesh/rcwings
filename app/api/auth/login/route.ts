import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword, generateToken } from "@/lib/auth";

/**
 * Constant-time dummy hash used when no user is found, to prevent a
 * timing oracle that would let an attacker enumerate valid email addresses.
 */
const DUMMY_HASH =
    "$2b$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ012345";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, password } = body;

        // --- Input Validation (mirrors registration rules) ---
        if (
            !email ||
            typeof email !== "string" ||
            !email.includes("@")
        ) {
            return NextResponse.json(
                { message: "A valid email is required." },
                { status: 400 }
            );
        }

        if (!password || typeof password !== "string") {
            return NextResponse.json(
                { message: "Password is required." },
                { status: 400 }
            );
        }

        const normalizedEmail = email.trim().toLowerCase();

        // --- Find user ---
        const user = await prisma.user.findUnique({
            where: { email: normalizedEmail },
        });

        if (!user) {
            // Run a dummy bcrypt comparison to keep response time constant,
            // preventing attackers from distinguishing "no such user" vs "wrong password".
            await comparePassword(password, DUMMY_HASH);
            return NextResponse.json(
                { message: "Invalid email or password." },
                { status: 401 }
            );
        }

        // --- Verify password ---
        const passwordMatch = await comparePassword(password, user.password);

        if (!passwordMatch) {
            return NextResponse.json(
                { message: "Invalid email or password." },
                { status: 401 }
            );
        }

        // --- Generate JWT ---
        const token = generateToken({ userId: user.id, role: user.role });

        return NextResponse.json(
            {
                message: "Login successful.",
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error("[LOGIN ERROR]", message);
        return NextResponse.json(
            { message: "Internal server error." },
            { status: 500 }
        );
    }
}
