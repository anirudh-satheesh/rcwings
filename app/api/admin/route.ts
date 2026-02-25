import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/verifyToken";

export async function GET(req: NextRequest) {
    try {
        const authHeader = req.headers.get("authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json(
                { message: "Unauthorized: No token provided." },
                { status: 401 }
            );
        }

        const token = authHeader.split(" ")[1];
        const decoded = verifyToken(token);

        if (!decoded) {
            return NextResponse.json(
                { message: "Unauthorized: Invalid or expired token." },
                { status: 401 }
            );
        }

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
        console.error("[ADMIN ERROR]", error);
        return NextResponse.json(
            { message: "Internal server error." },
            { status: 500 }
        );
    }
}
