import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, password } = body;

        // --- Input Validation ---
        if (!email || typeof email !== "string" || !email.includes("@")) {
            return NextResponse.json(
                { message: "A valid email is required." },
                { status: 400 }
            );
        }

        if (!password || typeof password !== "string" || password.length < 6) {
            return NextResponse.json(
                { message: "Password must be at least 6 characters." },
                { status: 400 }
            );
        }

        const normalizedEmail = email.trim().toLowerCase();

        // --- Fast-path UX check for existing user ---
        const existingUser = await prisma.user.findUnique({
            where: { email: normalizedEmail },
        });

        if (existingUser) {
            return NextResponse.json(
                { message: "An account with this email already exists." },
                { status: 409 }
            );
        }

        // --- Hash password & create user ---
        const hashedPassword = await hashPassword(password);

        const user = await prisma.user.create({
            data: {
                email: normalizedEmail,
                password: hashedPassword,
            },
            select: {
                id: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });

        return NextResponse.json(
            { message: "Account created successfully.", user },
            { status: 201 }
        );
    } catch (error) {
        // Handle race condition: another request created the same email between
        // our findUnique check and the create call.
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2002"
        ) {
            return NextResponse.json(
                { message: "An account with this email already exists." },
                { status: 409 }
            );
        }

        const message = error instanceof Error ? error.message : "Unknown error";
        console.error("[REGISTER ERROR]", message);
        return NextResponse.json(
            { message: "Internal server error." },
            { status: 500 }
        );
    }
}
