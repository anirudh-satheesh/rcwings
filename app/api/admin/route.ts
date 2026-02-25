import { NextRequest, NextResponse } from "next/server";
import { authenticate } from "@/lib/authenticate";

export async function GET(req: NextRequest) {
    try {
        const auth = authenticate(req);
        if (auth.error) return auth.error;

        const { decoded } = auth;

        // --- Role-Based Access Control ---
        if (decoded.role !== "ADMIN") {
            return NextResponse.json(
                { message: "Forbidden: Admin access required." },
                { status: 403 }
            );
        }

        return NextResponse.json(
            {
                message: "Welcome, Admin.",
                user: {
                    userId: decoded.userId,
                    role: decoded.role,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error("[ADMIN ERROR]", message);
        return NextResponse.json(
            { message: "Internal server error." },
            { status: 500 }
        );
    }
}
