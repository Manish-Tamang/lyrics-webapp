"use client";

import { Button } from "@/components/ui/button";
import { Sun, Moon, Laptop, Github, Twitter, Music2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";

export function Footer() {
  const { setTheme } = useTheme();

  return (
    <footer className="border-t border-green-500/10 bg-background">
      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Logo and Copyright */}
          <div className="flex items-center ml-4 gap-2">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} LyricVerse. All rights reserved.
            </p>
          </div>

          {/* Center Links */}
          <div className="flex items-center gap-4">


          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
          <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 px-0">
                  <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  <Sun className="h-4 w-4 mr-2" />
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  <Moon className="h-4 w-4 mr-2" />
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  <Laptop className="h-4 w-4 mr-2" />
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <span className="text-sm mr-4 text-muted-foreground">
              Built with
              <span className="mx-1 text-green-500">❤️</span>
              by{" "}
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="font-medium hover:text-green-500 transition-colors"
              >
                LyricVerse
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}