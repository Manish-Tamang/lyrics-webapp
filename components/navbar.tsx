"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const genres = [
  {
    title: "Pop",
    href: "/genres/pop",
  },
  {
    title: "Rock",
    href: "/genres/rock",
  },
  {
    title: "Hip Hop",
    href: "/genres/hip-hop",
  },
  {
    title: "Electronic",
    href: "/genres/electronic",
  },
];

const discover = [
  {
    title: "Top Charts",
    href: "/charts",
    description: "Browse the most popular songs and trending lyrics.",
  },
  {
    title: "New Releases",
    href: "/new",
    description: "Discover the latest songs and fresh releases.",
  },
  {
    title: "Artists",
    href: "/artists",
    description: "Explore artists and their complete discographies.",
  },
  {
    title: "Genres",
    href: "/genres",
    description: "Find music categorized by different genres and styles.",
  },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      // Store the search query in localStorage for suggestions
      const searchHistory = JSON.parse(
        localStorage.getItem("searchHistory") || "[]"
      );
      if (!searchHistory.includes(trimmedQuery)) {
        searchHistory.unshift(trimmedQuery);
        localStorage.setItem(
          "searchHistory",
          JSON.stringify(searchHistory.slice(0, 5))
        );
      }
      router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4">
        <Link href="/" className="flex items-center">
          <span className="text-xl font-bold text-primary-foreground">
            LyricVerse
          </span>
        </Link>

        {}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList className="gap-0">
            <NavigationMenuItem>
              <Link href="/" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Home
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/song" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Songs
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/artists" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Artists
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/about" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  About
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/submit-lyrics" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Submit Lyrics
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {}
        <div className="hidden md:flex items-center gap-4">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search songs..."
              className="w-[200px] rounded-[4px] pl-8 md:w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>

        {}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>

      {}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-background px-4 py-4">
          <div className="space-y-4">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search songs..."
                className="w-full rounded-[4px] pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
            <nav className="flex flex-col gap-2">
              <Link
                href="/"
                className="px-3 py-2 hover:bg-accent rounded-[4px]"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/song"
                className="px-3 py-2 hover:bg-accent rounded-[4px]"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Songs
              </Link>
              <Link
                href="/artists"
                className="px-3 py-2 hover:bg-accent rounded-[4px]"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Artists
              </Link>
              <Link
                href="/about"
                className="px-3 py-2 hover:bg-accent rounded-[4px]"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/submit-lyrics"
                className="px-3 py-2 hover:bg-accent rounded-[4px]"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Submit Lyrics
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { title: string }
>(({ className, title, children, href, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          href={href}
          className={cn(
            "block select-none space-y-1 rounded-[4px] p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          {children && (
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          )}
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
