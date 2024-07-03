import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { z } from "zod";
import { RateLimiter } from "limiter";

const limiter = new RateLimiter({
    tokensPerInterval: 4,
    interval: "minute",
    fireImmediately: true,
});

const urlSchema = z.object({
    url: z.string().url().max(2000),
});

export async function POST(request: Request) {
    const remainingRequests = await limiter.removeTokens(1);
    if (remainingRequests < 0) {
        return NextResponse.json(
            {
                success: false,
                error: "Rate limit exceeded. Please try again later.",
            },
            { status: 429 }
        );
    }

    let url: string;
    try {
        const body = await request.json();
        const validatedData = urlSchema.parse(body);
        url = validatedData.url;
    } catch (error) {
        console.error("Validation error:", error);
        return NextResponse.json(
            { success: false, error: "Invalid URL format" },
            { status: 400 }
        );
    }

    const shortCode = generateUniqueCode();

    try {
        const existingUrl = await query(
            "SELECT short_code FROM urls WHERE original_url = $1",
            [url]
        );

        if (existingUrl.rows.length > 0) {
            return NextResponse.json({
                success: true,
                shortCode: existingUrl.rows[0].short_code,
            });
        }

        await query(
            "INSERT INTO urls (original_url, short_code) VALUES ($1, $2)",
            [url, shortCode]
        );

        return NextResponse.json({ success: true, shortCode: shortCode });
    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to create short URL" },
            { status: 500 }
        );
    }
}

function generateUniqueCode(): string {
    // const timestamp = Date.now().toString(36);
    // const randomStr = Math.random().toString(36).substring(2, 6);
    // return `${timestamp}-${randomStr}`;
    // Less random, but shorter to begin with:
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const codeLength = 6;
    let result = "";
    for (let i = 0; i < codeLength; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * characters.length)
        );
    }
    return result;
}
