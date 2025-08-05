import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
    try {
        const result = await query('SELECT COUNT(*) as count FROM urls');
        const count = parseInt(result.rows[0].count, 10);

        const response = NextResponse.json({ count });
        // Cache the result for 60 seconds on the edge
        response.headers.set(
            'Cache-Control',
            's-maxage=60, stale-while-revalidate'
        );

        return response;
    } catch (error) {
        console.error('Error fetching URL count:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
