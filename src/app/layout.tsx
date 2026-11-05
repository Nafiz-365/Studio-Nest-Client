import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const openSans = Open_Sans({
    variable: "--font-open-sans",
    subsets: ["latin"],
    display: "swap",
});

export const metadata: Metadata = {
    title: "StudioNest | Creative spaces, thoughtfully shared",
    description: "Find, book, and share production-ready creative studios.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
    return (
        <html
            lang="en"
            data-scroll-behavior="smooth"
            className={`${openSans.className} h-full antialiased`}
        >
            <body className="min-h-full flex flex-col bg-bg text-text antialiased">
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
