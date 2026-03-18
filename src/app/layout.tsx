import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    metadataBase: new URL("https://a.isdevs.cv"),
    title: {
        default: "Breve",
        template: "%s | Breve",
    },
    description:
        "A fast, secure, premium and self-hosted URL shortener for all your links.",
    keywords: [
        "url shortener",
        "link shortener",
        "breve",
        "analytics",
        "tracking",
    ],
    authors: [{ name: "Breve Team" }],
    creator: "Breve Team",
    publisher: "Breve Team",
    robots: {
        index: true,
        follow: true,
    },
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "/",
        siteName: "Breve",
        title: "Breve",
        description:
            "A fast, secure, premium and self-hosted URL shortener for all your links.",
    },
    twitter: {
        card: "summary_large_image",
        title: "Breve",
        description:
            "A fast, secure, premium and self-hosted URL shortener for all your links.",
        creator: "@breve",
    },
    icons: {
        icon: "/logo.png",
        shortcut: "/logo.png",
        apple: "/logo.png",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                {children}
            </body>
        </html>
    );
}
