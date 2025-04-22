"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { db } from "@/lib/firebase/config";
import { collection, query, getDocs, limit } from "firebase/firestore";
import { Song } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Clock, Calendar, Disc } from "lucide-react";
import Image from "next/image";

const CACHE_DURATION = 5 * 60 * 1000;

const SongCardSkeleton = () => (
  <div className="rounded-lg border bg-card p-4">
    <Skeleton className="aspect-square w-full rounded-md" />
    <div className="mt-4 space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  </div>
);

export default function SearchPage() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("q")?.trim().toLowerCase();
  const [results, setResults] = useState<Song[]>([]);
  const [suggestions, setSuggestions] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("searchHistory") || "[]");
    setSearchHistory(history);
  }, []);

  useEffect(() => {
    const searchSongs = async () => {
      if (!queryParam) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const cacheKey = `search_${queryParam}`;
        const cachedResults = localStorage.getItem(cacheKey);
        const cacheTimestamp = localStorage.getItem(`${cacheKey}_timestamp`);

        if (cachedResults && cacheTimestamp) {
          const timestamp = parseInt(cacheTimestamp);
          if (Date.now() - timestamp < CACHE_DURATION) {
            setResults(JSON.parse(cachedResults));
            setLoading(false);
            return;
          }
        }

        const songsRef = collection(db, "songs");
        const songsSnapshot = await getDocs(songsRef);
        const allSongs = songsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Song[];

        const filteredResults = allSongs.filter(
          (song) =>
            song.title.toLowerCase().includes(queryParam) ||
            song.artist.toLowerCase().includes(queryParam)
        );

        localStorage.setItem(cacheKey, JSON.stringify(filteredResults));
        localStorage.setItem(`${cacheKey}_timestamp`, Date.now().toString());

        setResults(filteredResults.slice(0, 10));

        if (filteredResults.length === 0) {
          const suggestionsQuery = query(songsRef, limit(5));
          const suggestionsSnapshot = await getDocs(suggestionsQuery);
          const suggestedSongs = suggestionsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Song[];
          setSuggestions(suggestedSongs);
        } else {
          setSuggestions([]);
        }

        if (!searchHistory.includes(queryParam)) {
          const updatedHistory = [
            queryParam,
            ...searchHistory.slice(0, 4),
          ];
          setSearchHistory(updatedHistory);
          localStorage.setItem(
            "searchHistory",
            JSON.stringify(updatedHistory)
          );
        }
      } catch (error) {
        console.error(error);
        setError("An error occurred while searching. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    searchSongs();
  }, [queryParam]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Search Results</h1>
            <p className="mt-2 text-muted-foreground">
              Loading search results...
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <SongCardSkeleton key={`skeleton-${i}`} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Search Results</h1>
          <p className="mt-2 text-muted-foreground">
            Showing results for "{queryParam}"
          </p>
          {searchHistory.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="text-sm text-muted-foreground">Recent searches:</span>
              {searchHistory.map((term, index) => (
                <Link
                  key={index}
                  href={`/search?q=${encodeURIComponent(term)}`}
                  className="text-sm text-primary hover:underline"
                >
                  {term}
                </Link>
              ))}
            </div>
          )}
        </div>

        {error ? (
          <div className="text-center text-destructive">{error}</div>
        ) : results.length === 0 ? (
          <div className="space-y-6">
            <div className="text-center text-muted-foreground">
              No results found for "{queryParam}"
            </div>
            
            {suggestions.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">You might be interested in:</h2>
                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                  {suggestions.map((song) => (
                    <Link key={song.id} href={`/song/${song.slug}`}>
                      <div className="rounded-lg border bg-card p-4 hover:bg-accent transition-colors">
                        <div className="relative aspect-square w-full overflow-hidden rounded-md">
                          <Image
                            src={song.imageUrl || "/placeholder.svg"}
                            alt={song.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="mt-4 space-y-2">
                          <h3 className="font-medium">{song.title}</h3>
                          <p className="text-sm text-muted-foreground">{song.artist}</p>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className="rounded-[4px]">
                              {song.genre}
                            </Badge>
                            {song.album && (
                              <span className="text-sm text-muted-foreground">
                                {song.album}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {results.map((song) => (
              <Link key={song.id} href={`/song/${song.slug}`}>
                <div className="rounded-lg border bg-card p-4 hover:bg-accent transition-colors">
                  <div className="relative aspect-square w-full overflow-hidden rounded-md">
                    <Image
                      src={song.imageUrl || "/placeholder.svg"}
                      alt={song.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="mt-4 space-y-2">
                    <h3 className="font-medium">{song.title}</h3>
                    <p className="text-sm text-muted-foreground">{song.artist}</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="rounded-[4px]">
                        {song.genre}
                      </Badge>
                      {song.album && (
                        <span className="text-sm text-muted-foreground">
                          {song.album}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}