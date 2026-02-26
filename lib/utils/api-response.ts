import { NextResponse } from "next/server";

export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
    error?: any;
    meta?: {
        page?: number;
        limit?: number;
        total?: number;
        pages?: number;
    };
}

export function sendSuccess<T>(data: T, message?: string, statusCode = 200, meta?: any) {
    return NextResponse.json(
        {
            success: true,
            message,
            data,
            meta,
        },
        { status: statusCode }
    );
}

export function sendError(message: string, statusCode = 500, error?: any) {
    return NextResponse.json(
        {
            success: false,
            message,
            error: process.env.NODE_ENV === "development" ? error : undefined,
        },
        { status: statusCode }
    );
}
