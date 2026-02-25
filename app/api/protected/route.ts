import { NextRequest, NextResponse } from "next/server";
import { authenticate } from "@/lib/authenticate";

export async function GET(req: NextRequest) {
    try {
        const auth = authenticate(req);
        if (auth.error) return auth.error;

        const { decoded } = auth;

        return NextResponse.json(
            {
                message: "Access granted.",
                user: {
                    userId: decoded.userId,
                    role: decoded.role,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error("[PROTECTED ERROR]", message);
        return NextResponse.json(
            { message: "Internal server error." },
            { status: 500 }
        );
    }
}
