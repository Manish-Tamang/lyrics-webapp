import './globals.css';
import type React from "react";

export const metadata = {
    title: 'LyricVerse',
    description: 'LyricVerse',
}

export default function RootLayout({ children }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}