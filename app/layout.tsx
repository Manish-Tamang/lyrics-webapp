import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import localFont from "next/font/local";
import type React from "react";
import type { Metadata } from "next"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

const geist = localFont({
  src: [
    {
      path: '../public/fonts/Geist-Thin.otf',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../public/fonts/Geist-ExtraLight.otf',
      weight: '200',
      style: 'normal',
    },
    {
      path: '../public/fonts/Geist-Light.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../public/fonts/Geist-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/Geist-Medium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/Geist-SemiBold.otf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../public/fonts/Geist-Bold.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../public/fonts/Geist-ExtraBold.otf',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../public/fonts/Geist-Black.otf',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-geist',
});

const bethany = localFont({
  src: [
    {
      path: '../public/fonts/Bethany Elingston.otf',
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
      <body className={`${geist.variable} ${poppins.variable} ${bethany.variable} font-sans bg-[#FAFAFA]`}>
        <Navbar />
        <main className="mx-auto max-w-[670px] px-4 py-6">{children}</main>
        <Footer />
      </body>
    </html>
  )
}

import './globals.css'