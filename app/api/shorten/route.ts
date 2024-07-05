import { NextResponse } from "next/server";
import { getClient } from "@/lib/db";
import { z } from "zod";
import { RateLimiter } from "limiter";

const limiter = new RateLimiter({
    tokensPerInterval: 4,
    interval: "minute",
    fireImmediately: true,
});

const urlSchema = z.object({
    url: z.string().url().max(2000),
    shortCode: z
        .string()
        .regex(/^[a-zA-Z0-9_-]{1,20}$/, {
            message:
                "Short code must be 1-20 characters and can only contain letters, numbers, underscores, and hyphens",
        })
        .optional()
        .or(z.literal("")),
});

const MAX_RETRIES = 10; // Maximum number of attempts to generate a unique short code. Because the code generation is not truly random, there is a higher possibility of collisions.

export async function POST(request: Request) {
    const client = await getClient();
    try {
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
        let shortCode: string | null;
        let isCustomShortCode: boolean;

        try {
            const body = await request.json();
            const validatedData = urlSchema.parse(body);
            url = validatedData.url;
            isCustomShortCode =
                !!validatedData.shortCode && validatedData.shortCode !== "";
            shortCode =
                validatedData.shortCode && validatedData.shortCode !== ""
                    ? validatedData.shortCode
                    : null;
        } catch (error) {
            if (error instanceof z.ZodError) {
                const issues = error.issues
                    .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
                    .join(", ");
                return NextResponse.json(
                    { success: false, error: `Validation error: ${issues}` },
                    { status: 400 }
                );
            }
            throw error;
        }

        await client.query("BEGIN");

        if (!isCustomShortCode) {
            const existingUrl = await client.query(
                "SELECT short_code FROM urls WHERE original_url = $1 AND is_custom = false",
                [url]
            );

            if (existingUrl.rows.length > 0) {
                await client.query("COMMIT");
                return NextResponse.json({
                    success: true,
                    shortCode: existingUrl.rows[0].short_code,
                    message:
                        "Your short link is ready - it was already created earlier.",
                });
            }

            let retryCount = 0;
            while (retryCount < MAX_RETRIES) {
                shortCode = generateUniqueCode();
                const existingCode = await client.query(
                    "SELECT short_code FROM urls WHERE short_code = $1",
                    [shortCode]
                );
                if (existingCode.rows.length === 0) break;
                retryCount++;
            }

            if (retryCount === MAX_RETRIES) {
                await client.query("ROLLBACK");
                console.error(
                    "Failed to generate a unique short code after maximum retries"
                );
                return NextResponse.json(
                    {
                        success: false,
                        error: "Unable to generate a unique short code. Please try again.",
                    },
                    { status: 500 }
                );
            }
        } else {
            const existingCode = await client.query(
                "SELECT original_url FROM urls WHERE short_code = $1",
                [shortCode]
            );

            if (existingCode.rows.length > 0) {
                await client.query("COMMIT");
                return NextResponse.json({
                    success: true,
                    shortCode: shortCode,
                    message:
                        "Your short link is ready - it was already created earlier.",
                });
            }
        }

        await client.query(
            "INSERT INTO urls (original_url, short_code, is_custom) VALUES ($1, $2, $3)",
            [url, shortCode, isCustomShortCode]
        );

        await client.query("COMMIT");

        return NextResponse.json({
            success: true,
            shortCode: shortCode,
            message: "Short URL created successfully.",
        });
    } catch (error) {
        await client.query("ROLLBACK");
        console.error("Error in POST function:", error);
        let errorMessage = "An unexpected error occurred. Please try again.";
        let statusCode = 500;

        if (error instanceof Error) {
            switch (error.message) {
                case "Database connection error":
                    errorMessage =
                        "Unable to connect to the database. Please try again later.";
                    break;
                default:
                    errorMessage = `Error creating short URL: ${error.message}`;
            }
        }

        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: statusCode }
        );
    } finally {
        client.release();
    }
}

function generateUniqueCode(): string {
    // A more random code generation function can be used here.
    const characters =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const codeLength = 6;
    let result = "";
    for (let i = 0; i < codeLength; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * characters.length)
        );
    }
    return result;
}
