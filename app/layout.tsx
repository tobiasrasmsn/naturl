import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import Footer from "@/components/shared/Footer";
import { Analytics } from "@vercel/analytics/react";
const pjs = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Naturl | URL Shortener",
    description: "Shortening URLs has never been easier.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={pjs.className}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    disableTransitionOnChange
                >
                    {/* <Navigation /> */}
                    {children}
                    <Toaster className="opacity-75" />
                    <Footer />
                    <Analytics />
                </ThemeProvider>
            </body>
        </html>
    );
}
