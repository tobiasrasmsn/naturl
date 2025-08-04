import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Revalidate every day. This will cache the redirect response.
export const revalidate = 86400;

export async function GET(
    request: NextRequest,
    { params }: { params: { shortcode: string[] } }
) {
    const shortCode = params.shortcode[0];
    const homeURL = new URL('/', request.url);

    if (!shortCode) {
        return NextResponse.redirect(homeURL);
    }

    try {
        const result = await query(
            'SELECT original_url FROM urls WHERE short_code = $1',
            [shortCode]
        );

        if (result.rows.length === 0) {
            return NextResponse.redirect(homeURL);
        }

        const originalUrl = result.rows[0].original_url;

        // Using 308 for permanent redirect
        return NextResponse.redirect(originalUrl, { status: 308 });
    } catch (error) {
        console.error('Error handling redirect:', error);
        return NextResponse.redirect(homeURL);
    }
}
