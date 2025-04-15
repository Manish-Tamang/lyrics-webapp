import './globals.css';
import type React from "react";
import { Toaster } from "sonner";

export const metadata = {
    title: 'LyricVerse',
    description: 'LyricVerse',
}

export default function RootLayout({ children }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                {children}
                <Toaster position="top-right" />
            </body>
        </html>
    );
}