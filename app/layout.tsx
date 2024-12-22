import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';
import Footer from '@/components/shared/Footer';
import Donate from '@/components/shared/donate';
import { Analytics } from '@vercel/analytics/react';
const pjs = Plus_Jakarta_Sans({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Naturl | URL Shortener',
    description: 'Shortening URLs has never been easier.',
    keywords:
        'url shortener, link shortener, short url, url shorter, link management, free url shortener, free link shortener, free short url, free url shorter, free link management',
    openGraph: {
        title: 'Naturl | URL Shortener',
        description: 'Shortening URLs has never been easier.',
        type: 'website',
        url: 'https://www.naturl.link',
        images: [
            {
                url: '/opengraph-image.jpg',
                width: 1200,
                height: 630,
                alt: 'Naturl URL Shortener',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Naturl | URL Shortener',
        description: 'Shortening URLs has never been easier.',
        images: ['/twitter-image.jpg'],
    },
    alternates: {
        canonical: 'https://www.naturl.link',
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='en' suppressHydrationWarning>
            <body className={pjs.className}>
                <ThemeProvider
                    attribute='class'
                    defaultTheme='dark'
                    disableTransitionOnChange
                >
                    {children}
                    <Toaster richColors />
                    <Footer />
                    <Donate />
                    <Analytics />
                </ThemeProvider>
            </body>
        </html>
    );
}
