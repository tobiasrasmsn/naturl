import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/shared/Navigation";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";

const pjs = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Naturl",
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
                    <Toaster />
                </ThemeProvider>
            </body>
        </html>
    );
}
