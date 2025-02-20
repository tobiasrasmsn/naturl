import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { url } = await request.json();

        if (!url) {
            return NextResponse.json(
                { error: 'No URL provided' },
                { status: 400 }
            );
        }

        const GOOGLE_SAFE_BROWSING_API_KEY =
            process.env.GOOGLE_SAFE_BROWSING_API_KEY;
        const safeBrowsingURL = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${GOOGLE_SAFE_BROWSING_API_KEY}`;

        const requestBody = {
            client: {
                clientId: 'naturl', // Optional
                clientVersion: '1.0',
            },
            threatInfo: {
                threatTypes: [
                    'MALWARE',
                    'SOCIAL_ENGINEERING',
                    'UNWANTED_SOFTWARE',
                    'POTENTIALLY_HARMFUL_APPLICATION',
                    'THREAT_TYPE_UNSPECIFIED',
                ],
                platformTypes: ['ANY_PLATFORM'],
                threatEntryTypes: ['URL'],
                threatEntries: [{ url }],
            },
        };

        const response = await fetch(safeBrowsingURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Referer:
                    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
            },
            body: JSON.stringify(requestBody),
        });

        const data = await response.json();
        console.log(data);
        if (data.matches) {
            return NextResponse.json(
                { safe: false, message: 'URL is flagged as unsafe!' },
                { status: 403 }
            );
        }

        return NextResponse.json(
            { safe: true, message: 'URL is safe.' },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            {
                error: 'Internal Server Error',
                details:
                    error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}
