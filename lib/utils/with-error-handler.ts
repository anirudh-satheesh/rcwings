import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "../errors/api-error";
import { sendError } from "./api-response";
import { ZodError } from "zod";

type Handler = (req: NextRequest, ...args: any[]) => Promise<NextResponse>;

/**
 * Higher-order function to wrap API handlers with centralized error handling.
 * Automatically catches ApiErrors, Zod validation errors, and unexpected exceptions.
 */
export function withErrorHandler(handler: Handler) {
    return async (req: NextRequest, ...args: any[]) => {
        try {
            return await handler(req, ...args);
        } catch (error: any) {
            const message = error.message || "Something went wrong";
            console.error(`[API ERROR] ${req.nextUrl.pathname}:`, message);

            if (error instanceof ApiError) {
                return sendError(error.message, error.statusCode, error.errors);
            }

            if (error instanceof ZodError) {
                return sendError("Validation Error", 400, error.issues);
            }

            // Handle Prisma Unique Constraint specifically
            if (error.code === "P2002") {
                return sendError("Resource already exists", 409);
            }

            // Handle Prisma Record Not Found (often ownership issues in our case)
            if (error.code === "P2025") {
                return sendError("Resource not found or unauthorized", 404);
            }

            // Log full error for production debugging
            console.error(`[UNEXPECTED ERROR] ${req.nextUrl.pathname}:`, error);

            return sendError(
                "Internal Server Error",
                500,
                process.env.NODE_ENV === "development" ? error : undefined
            );
        }
    };
}
