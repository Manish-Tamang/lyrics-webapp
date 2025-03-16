import type React from "react"
import AdminNavbar from "@/components/admin/admin-navbar"
import { Separator } from "@/components/ui/separator"
import { Karla } from 'next/font/google';

const karla = Karla({ subsets: ['latin'] });

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`${karla.className} flex min-h-screen flex-col`}>
      <AdminNavbar />
      <div className="container mx-auto max-w-7xl px-4 py-6">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <Separator className="my-4" />
        {children}
      </div>
    </div>
  )
}