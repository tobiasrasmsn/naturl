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
    metadataBase: new URL('https://www.naturl.link'),
    title: 'Naturl | URL Shortener',
    description: 'Shortening URLs has never been easier.',
    alternates: {
        canonical: '/',
        languages: {
            'en-US': '/en-US',
        },
    },
    openGraph: {
        images: '/opengraph-image.jpg',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Naturl | URL Shortener',
        description: 'Shortening URLs has never been easier.',
        images: ['/twitter-image.jpg'],
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
