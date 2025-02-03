"use client";

import Link from "next/link";
import { Music2, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();

  const isActivePath = (path: string) => {
    return pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-green-500/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 group">
          <span className="font-bold text-xl ml-4 sm:inline bg-gradient-to-r from-green-500 to-emerald-600 text-transparent bg-clip-text">
            LyricVerse
          </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/"
            className={`text-sm font-medium transition-all duration-200 hover:text-green-500 ${isActivePath('/') ? 'text-green-500 scale-105' : ''
              }`}
          >
            Home
          </Link>
          <Link
            href="/songs"
            className={`text-sm font-medium transition-all duration-200 hover:text-green-500 ${isActivePath('/songs') ? 'text-green-500 scale-105' : ''
              }`}
          >
            Songs
          </Link>
          <Link
            href="/playlists"
            className={`text-sm font-medium transition-all duration-200 hover:text-green-500 ${isActivePath('/playlists') ? 'text-green-500 scale-105' : ''
              }`}
          >
            Playlists
          </Link>
          <Link
            href="/artists"
            className={`text-sm font-medium transition-all duration-200 hover:text-green-500 ${isActivePath('/artists') ? 'text-green-500 scale-105' : ''
              }`}
          >
            Artists
          </Link>
        </nav>

        {/* Search Bar */}
        <div className="hidden md:flex items-center space-x-4 flex-1 max-w-xs mx-6">
          <div className="relative w-full group">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground group-hover:text-green-500 transition-colors duration-200" />
            <Input
              placeholder="Search songs..."
              className="pl-8 w-full focus-visible:ring-green-500 transition-all duration-200"
            />
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          <Button
            variant="default"
            size="sm"
            className="hidden mr-5 md:inline-flex bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Sign In
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden hover:text-green-500 transition-colors duration-200">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <nav className="flex flex-col space-y-4 mt-6">
                <Link
                  href="/"
                  className={`text-sm font-medium transition-colors duration-200 hover:text-green-500 ${isActivePath('/') ? 'text-green-500' : ''
                    }`}
                >
                  Home
                </Link>
                <Link
                  href="/songs"
                  className={`text-sm font-medium transition-colors duration-200 hover:text-green-500 ${isActivePath('/songs') ? 'text-green-500' : ''
                    }`}
                >
                  Songs
                </Link>
                <Link
                  href="/playlists"
                  className={`text-sm font-medium transition-colors duration-200 hover:text-green-500 ${isActivePath('/playlists') ? 'text-green-500' : ''
                    }`}
                >
                  Playlists
                </Link>
                <Link
                  href="/artists"
                  className={`text-sm font-medium transition-colors duration-200 hover:text-green-500 ${isActivePath('/artists') ? 'text-green-500' : ''
                    }`}
                >
                  Artists
                </Link>
                <div className="relative w-full mt-2">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search songs..."
                    className="pl-8 w-full focus-visible:ring-green-500"
                  />
                </div>
                <Button
                  className="w-full mt-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transition-all duration-300"
                >
                  Sign In
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}