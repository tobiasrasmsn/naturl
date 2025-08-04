import { NextResponse } from 'next/server';
import { getClient } from '@/lib/db';
import { z } from 'zod';
import { Redis } from '@upstash/redis';
import { createHash } from 'crypto';

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Rate limiting per day
const IP_LIMIT = 5; // Max 5 ideas per day per IP
const WINDOW_SIZE = 86400; // 24 hours in seconds

function hashIP(ip: string): string {
    const salt = process.env.IP_HASH_SALT || 'default-salt';
    return createHash('sha256')
        .update(ip + salt)
        .digest('hex');
}

const ideaSchema = z.object({
    content: z.string().min(10).max(500),
    author_id: z.string(),
});

export async function GET() {
    const client = await getClient();
    try {
        const result = await client.query(
            'SELECT * FROM ideas ORDER BY created_at DESC'
        );
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error('Error fetching ideas:', error);
        return NextResponse.json(
            { error: 'Failed to fetch ideas' },
            { status: 500 }
        );
    } finally {
        client.release();
    }
}

export async function POST(request: Request) {
    const client = await getClient();
    try {
        const ip = request.headers.get('x-forwarded-for') || 'unknown';
        const hashedIP = hashIP(ip);
        const ipKey = `ratelimit_ideas_ip:${hashedIP}`;

        const ipRequests = await redis.incr(ipKey);

        if (ipRequests === 1) {
            await redis.expire(ipKey, WINDOW_SIZE);
        }

        if (ipRequests > IP_LIMIT) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'You have reached your daily limit for submitting ideas.',
                },
                { status: 429 }
            );
        }

        const body = await request.json();
        const validatedData = ideaSchema.parse(body);
        const { content, author_id } = validatedData;

        await client.query('BEGIN');
        const result = await client.query(
            'INSERT INTO ideas (content, author_id) VALUES ($1, $2) RETURNING *',
            [content, author_id]
        );
        await client.query('COMMIT');

        return NextResponse.json({ success: true, idea: result.rows[0] });
    } catch (error) {
        await client.query('ROLLBACK');
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { success: false, error: 'Invalid input.' },
                { status: 400 }
            );
        }
        console.error('Error creating idea:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create idea' },
            { status: 500 }
        );
    } finally {
        client.release();
    }
}
