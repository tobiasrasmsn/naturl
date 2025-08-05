import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const revalidate = 60;

export async function GET() {
    try {
        const result = await query('SELECT COUNT(*) as count FROM urls');
        const count = parseInt(result.rows[0].count, 10);

        return NextResponse.json({ count });
    } catch (error) {
        console.error('Error fetching URL count:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
