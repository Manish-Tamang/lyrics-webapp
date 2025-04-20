"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { db } from "@/lib/firebase/config";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import { Song } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("q");
  const [results, setResults] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const searchSongs = async () => {
      if (!queryParam) return;

      try {
        const songsRef = collection(db, "songs");
        const q = query(
          songsRef,
          where("title", ">=", queryParam.toLowerCase()),
          where("title", "<=", queryParam.toLowerCase() + "\uf8ff"),
          orderBy("title"),
          limit(20)
        );

        const querySnapshot = await getDocs(q);
        const songs: Song[] = [];
        querySnapshot.forEach((doc) => {
          songs.push({ id: doc.id, ...doc.data() } as Song);
        });

        setResults(songs);
      } catch (error) {
        console.error("Error searching songs:", error);
      } finally {
        setLoading(false);
      }
    };

    searchSongs();
  }, [queryParam]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        Search Results for "{queryParam}"
      </h1>
      
      {results.length === 0 ? (
        <div className="text-center text-muted-foreground">
          No results found for "{queryParam}"
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {results.map((song) => (
            <Link key={song.id} href={`/song/${song.slug}`}>
              <Card className="hover:bg-accent transition-colors">
                <CardHeader>
                  <CardTitle className="text-lg">{song.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2">
                    <p className="text-muted-foreground">{song.artist}</p>
                    <div className="flex gap-2">
                      <Badge variant="outline">{song.genre}</Badge>
                      <Badge variant="outline">{song.language}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
} 