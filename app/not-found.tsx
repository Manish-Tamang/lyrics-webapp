import Link from 'next/link'
import Image from 'next/image'
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import localFont from "next/font/local";
import { Karla } from 'next/font/google';

const karla = Karla({ subsets: ['latin'] });

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

export default function NotFound() {
  return (
    <div className={`${karla.className} ${bethany.variable} font-karla bg-[#FAFAFA]`}>
      <Navbar />
      <main className="mx-auto max-w-[720px] px-4 py-6">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center py-12">
          <h2 className="text-3xl font-bold mb-4">Page Not Found</h2>
          <p className="text-gray-600 mb-6">Could not find the requested page.</p>
          <Image
            src="/404.png"
            alt="Illustration for page not found page"
            width={600} 
            height={400}
            objectFit="contain"
            draggable="false"
            style={{ userSelect: "none" }}
          />
          <Link href="/" className="mt-8 text-blue-500 hover:underline">
            Return to Homepage
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
} 