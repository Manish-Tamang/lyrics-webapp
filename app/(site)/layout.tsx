import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import localFont from "next/font/local";
import type React from "react";
import type { Metadata } from "next"
import { Karla } from 'next/font/google';

const karla = Karla({ subsets: ['latin'] });

const bethany = localFont({
  src: [
    {
      path: '../../public/fonts/Bethany Elingston.otf',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-bethany',
});

export const metadata: Metadata = {
  title: "LyricVerse - Song Lyrics and Artist Info",
  description: "Discover song lyrics and artist information in a clean, minimalist interface",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${karla.className} ${bethany.variable} font-karla bg-[#FAFAFA]`}>
        <Navbar />
        <main className="mx-auto max-w-[720px] px-4 py-6">{children}</main>
        <Footer />
      </body>
    </html>
  )
}

import './globals.css'