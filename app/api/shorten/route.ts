import { NextResponse } from "next/server";
import { getClient } from "@/lib/db";
import { z } from "zod";
import { RateLimiter } from "limiter";
import { sanitizeUrl } from "@braintree/sanitize-url";

// Rate limiting per minute
const IP_LIMIT = 4;
const GLOBAL_LIMIT = 50;

const globalLimiter = new RateLimiter({
    tokensPerInterval: GLOBAL_LIMIT,
    interval: "minute",
    fireImmediately: true,
});

const ipLimiters = new Map<string, RateLimiter>();

const urlSchema = z.object({
    url: z.string().url().max(2000).transform(sanitizeUrl),
    shortCode: z
        .string()
        .regex(/^[a-zA-Z0-9_-]{1,20}$/, {
            message:
                "Short code must be 1-20 characters and can only contain letters, numbers, underscores, and hyphens",
        })
        .optional()
        .or(z.literal(""))
        .transform((val) => (val ? val.toLowerCase() : val)),
});

const MAX_RETRIES = 10;

export async function POST(request: Request) {
    const client = await getClient();
    try {
        const remainingGlobalRequests = await globalLimiter.removeTokens(1);
        if (remainingGlobalRequests < 0) {
            return createSecureResponse(
                {
                    success: false,
                    error: "Global rate limit exceeded. Please try again later.",
                },
                429
            );
        }

        const ip = request.headers.get("x-forwarded-for") || "unknown";
        if (!ipLimiters.has(ip)) {
            ipLimiters.set(
                ip,
                new RateLimiter({
                    tokensPerInterval: IP_LIMIT,
                    interval: "minute",
                    fireImmediately: true,
                })
            );
        }
        const ipLimiter = ipLimiters.get(ip)!;
        const remainingIpRequests = await ipLimiter.removeTokens(1);
        if (remainingIpRequests < 0) {
            return createSecureResponse(
                {
                    success: false,
                    error: "IP-based rate limit exceeded. Please try again later.",
                },
                429
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
                console.error("Validation error:", error.issues);
                return createSecureResponse(
                    {
                        success: false,
                        error: "Invalid input. Please check your URL and short code.",
                    },
                    400
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
                return createSecureResponse({
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
                return createSecureResponse(
                    {
                        success: false,
                        error: "Unable to generate a unique short code. Please try again.",
                    },
                    500
                );
            }
        } else {
            const existingCode = await client.query(
                "SELECT original_url FROM urls WHERE short_code = $1",
                [shortCode]
            );

            if (existingCode.rows.length > 0) {
                if (existingCode.rows[0].original_url === url) {
                    await client.query("COMMIT");
                    return createSecureResponse({
                        success: true,
                        shortCode: shortCode,
                        message:
                            "Your short link is ready - it was already created earlier.",
                    });
                } else {
                    await client.query("ROLLBACK");
                    return createSecureResponse(
                        {
                            success: false,
                            error: "This custom short code is already in use. Please choose a different one.",
                        },
                        409
                    );
                }
            }
        }

        const existingUrl = await client.query(
            "SELECT short_code FROM urls WHERE original_url = $1 AND is_custom = false",
            [url]
        );

        if (existingUrl.rows.length > 0 && !isCustomShortCode) {
            await client.query("COMMIT");
            return createSecureResponse({
                success: true,
                shortCode: existingUrl.rows[0].short_code,
                message: "A short link for this URL already exists.",
            });
        }

        await client.query(
            "INSERT INTO urls (original_url, short_code, is_custom) VALUES ($1, $2, $3)",
            [url, shortCode, isCustomShortCode]
        );

        await client.query("COMMIT");

        return createSecureResponse({
            success: true,
            shortCode: shortCode,
            message: "Short URL created successfully.",
        });
    } catch (error) {
        await client.query("ROLLBACK");
        console.error("Error in POST function:", error);
        return createSecureResponse(
            {
                success: false,
                error: "An unexpected error occurred. Please try again.",
            },
            500
        );
    } finally {
        client.release();
    }
}

function generateUniqueCode(): string {
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

function createSecureResponse(
    body: object,
    status: number = 200
): NextResponse {
    const response = NextResponse.json(body, { status });
    response.headers.set(
        "Strict-Transport-Security",
        "max-age=31536000; includeSubDomains"
    );
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    return response;
}

// TODO: Add a function that checks if the URL is malicious or not
