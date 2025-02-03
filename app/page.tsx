"use client";

import { SongList } from "@/components/song-list";
import { Button } from "@/components/ui/button";
import { Music2, Search, Star, TrendingUp, Headphones } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <section className="relative overflow-hidden min-h-[calc(100vh-4rem)]">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-transparent animate-gradient-slow" />

        {/* Floating music notes decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 animate-float-slow">
            <Music2 className="h-8 w-8 text-green-500/20" />
          </div>
          <div className="absolute top-40 right-20 animate-float-medium">
            <Music2 className="h-12 w-12 text-emerald-500/20" />
          </div>
          <div className="absolute bottom-40 left-1/4 animate-float-fast">
            <Music2 className="h-10 w-10 text-green-600/20" />
          </div>
        </div>

        <div className="container relative px-4 md:px-6 flex flex-col items-center space-y-8 py-16 md:py-20 lg:py-32">
          <div className="relative w-full max-w-5xl space-y-10 text-center">
            {/* Hero Section */}
            <div className="space-y-8">
              <div className="relative inline-block">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-green-500/30 to-emerald-500/30 blur-3xl rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-pulse-slow"
                />
              </div>
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                <span className="inline-block bg-gradient-to-br from-green-400 via-green-500 to-emerald-600 text-transparent bg-clip-text animate-gradient">
                  Discover the Poetry
                </span>
                <br />
                <span className="inline-block bg-gradient-to-r from-emerald-500 to-green-600 text-transparent bg-clip-text animate-gradient">
                  in Music
                </span>
              </h1>
              <p className="mx-auto max-w-[42rem] text-muted-foreground text-base sm:text-lg md:text-xl leading-normal">
                Explore our curated collection of song lyrics. Find the words that move you, inspire you, and speak to your soul.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 px-4">
              <Link href="/songs">
                <Button
                  size="lg"
                  className="w-full sm:w-auto gap-3 min-w-[220px] bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <Search className={`h-5 w-5 transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`} />
                  Browse Songs
                </Button>
              </Link>
              <Link href="/">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto gap-3 min-w-[220px] border-green-500/20 hover:border-green-500/40 transition-all duration-300"
                >
                  <Star className="h-5 w-5" />
                  Popular Lyrics
                </Button>
              </Link>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 mt-8 border-t border-green-500/10">
              <div className="flex flex-col items-center space-y-2">
                <Headphones className="h-6 w-6 text-green-500" />
                <span className="text-2xl font-bold text-green-500">10K+</span>
                <span className="text-sm text-muted-foreground">Songs</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <Music2 className="h-6 w-6 text-green-500" />
                <span className="text-2xl font-bold text-green-500">500+</span>
                <span className="text-sm text-muted-foreground">Artists</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <Star className="h-6 w-6 text-green-500" />
                <span className="text-2xl font-bold text-green-500">50K+</span>
                <span className="text-sm text-muted-foreground">Reviews</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <TrendingUp className="h-6 w-6 text-green-500" />
                <span className="text-2xl font-bold text-green-500">100K+</span>
                <span className="text-sm text-muted-foreground">Monthly Users</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Songs Section */}
      <section className="container px-4 md:px-6 space-y-8 py-16 md:py-20 lg:py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-green-500/5 to-transparent pointer-events-none" />
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center relative">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-green-500 to-emerald-600 text-transparent bg-clip-text">
            Featured Songs
          </h2>
          <p className="max-w-[85%] text-muted-foreground text-base sm:text-lg leading-normal">
            Discover our latest collection of handpicked songs from various artists and genres.
          </p>
        </div>
        <div className="mx-auto max-w-6xl relative">
          <SongList />
        </div>
      </section>
    </>
  );
}