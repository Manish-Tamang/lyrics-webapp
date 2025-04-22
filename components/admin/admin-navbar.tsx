"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Music, Users, FileText, Settings, LogOut, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useSession, signOut } from "next-auth/react"
import Image from "next/image"
import { db } from "@/lib/firebase/config"
import { doc, getDoc } from "firebase/firestore"

interface AdminUser {
  name: string;
  email: string;
  image?: string;
  role: string;
}

export default function AdminNavbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const { data: session } = useSession()
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAdminDetails = async () => {
      if (!session?.user?.email) return;

      try {
        const userDoc = await getDoc(doc(db, "users", session.user.email));
        if (userDoc.exists()) {
          const userData = userDoc.data() as AdminUser;
          setAdminUser(userData);
        }
      } catch (error) {
        console.error("Error fetching admin details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminDetails();
  }, [session]);

  const routes = [
    {
      href: "/admin",
      label: "Dashboard",
      active: pathname === "/admin",
    },
    {
      href: "/admin/submissions",
      label: "Submissions",
      active: pathname === "/admin/submissions",
    },
    {
      href: "/admin/artists",
      label: "Artists",
      active: pathname === "/admin/artists",
    },
    {
      href: "/admin/songs",
      label: "Songs",
      active: pathname === "/admin/songs",
    },
    {
      href: "/admin/profile",
      label: "Profile",
      active: pathname === "/admin/profile",
    },
  ]

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto flex h-16 max-w-7xl items-center px-4">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="mr-2">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[240px] sm:w-[300px]">
            <div className="flex flex-col space-y-4 py-4">
              <div className="flex items-center">
                <Music className="mr-2 h-5 w-5" />
                <span className="text-lg font-bold">LyricVerse Admin</span>
              </div>
              <nav className="flex flex-col space-y-1">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    onClick={() => setIsOpen(false)}
                    className={`rounded-md px-3 py-2 text-sm font-medium ${
                      route.active ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                    }`}
                  >
                    {route.label}
                  </Link>
                ))}
              </nav>
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex items-center">
          <Music className="mr-2 h-5 w-5" />
          <span className="text-lg font-bold hidden md:inline-block">LyricVerse Admin</span>
        </div>

        <nav className="mx-6 hidden md:flex md:items-center md:space-x-4 lg:space-x-6">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={`text-sm font-medium transition-colors ${
                route.active ? "text-primary" : "text-muted-foreground hover:text-primary"
              }`}
            >
              {route.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  {adminUser?.image ? (
                    <img
                      src={adminUser.image} 
                      alt={adminUser.name || "Admin"} 
                      className="object-cover"
                    />
                  ) : (
                    <AvatarFallback>
                      {adminUser?.name?.charAt(0) || session?.user?.name?.charAt(0) || "A"}
                    </AvatarFallback>
                  )}
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {adminUser?.name || session?.user?.name || "Admin User"}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {adminUser?.email || session?.user?.email || "admin@lyricverse.com"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/admin/profile">
                  <Users className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileText className="mr-2 h-4 w-4" />
                <span>Activity Log</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

