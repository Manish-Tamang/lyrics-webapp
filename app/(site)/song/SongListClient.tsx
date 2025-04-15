"use client";

import SongCard from "@/components/song-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase/config";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { Song } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

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

const SongListClient: React.FC = () => {
    const [songs, setSongs] = useState<Song[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchSongs();
    }, []);

    const fetchSongs = async () => {
        setLoading(true);
        try {
            // Check cache first
            const cachedSongs = localStorage.getItem('cachedSongs');
            const cacheTimestamp = localStorage.getItem('songsCacheTimestamp');
            const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

            if (cachedSongs && cacheTimestamp) {
                const timestamp = parseInt(cacheTimestamp);
                if (Date.now() - timestamp < CACHE_DURATION) {
                    setSongs(JSON.parse(cachedSongs));
                    setLoading(false);
                    return;
                }
            }

            // If no cache or cache expired, fetch from Firestore
            const songsQuery = query(collection(db, "songs"), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(songsQuery);
            
            const songsData: Song[] = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Song[];
            
            // Update cache
            localStorage.setItem('cachedSongs', JSON.stringify(songsData));
            localStorage.setItem('songsCacheTimestamp', Date.now().toString());
            
            setSongs(songsData);
            setError(null);
        } catch (error) {
            console.error("Error fetching songs:", error);
            setError("Failed to load songs. Please try again later.");
        } finally {
            setLoading(false);
        }
    };
    
    const songsByGenre: Record<string, Song[]> = {};

    songs.forEach((song) => {
        if (!songsByGenre[song.genre]) {
            songsByGenre[song.genre] = [];
        }
        songsByGenre[song.genre].push(song);
    });

    const genres = Object.keys(songsByGenre);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">All Songs</h1>
                <p className="mt-2 text-muted-foreground">
                    Browse our collection of song lyrics from various artists and genres.
                </p>
            </div>

            {error ? (
                <div className="text-red-500">{error}</div>
            ) : (
                <Tabs defaultValue="all" className="w-full">
                    <TabsList className="mb-6 w-full justify-start overflow-auto">
                        <TabsTrigger value="all" className="rounded-[4px]">
                            All
                        </TabsTrigger>
                        {genres.map((genre) => (
                            <TabsTrigger key={genre} value={genre} className="rounded-[4px]">
                                {genre}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    <TabsContent value="all" className="mt-0">
                        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                            {loading ? (
                                Array.from({ length: 6 }).map((_, index) => (
                                    <SongCardSkeleton key={index} />
                                ))
                            ) : (
                                songs.map((song) => (
                                    <SongCard
                                        key={song.id}
                                        id={song.id}
                                        title={song.title}
                                        artist={song.artist}
                                        album={song.album}
                                        coverImage={song.imageUrl || "/placeholder.svg"} 
                                        duration={song.duration}
                                        genre={song.genre}
                                        lyrics={song.lyrics}
                                    />
                                ))
                            )}
                        </div>
                    </TabsContent>

                    {genres.map((genre) => (
                        <TabsContent key={genre} value={genre} className="mt-0">
                            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                                {loading ? (
                                    Array.from({ length: 6 }).map((_, index) => (
                                        <SongCardSkeleton key={index} />
                                    ))
                                ) : (
                                    songsByGenre[genre].map((song) => (
                                        <SongCard
                                            key={song.id}
                                            id={song.id}
                                            title={song.title}
                                            artist={song.artist}
                                            album={song.album}
                                            coverImage={song.imageUrl || "/placeholder.svg"}
                                            duration={song.duration}
                                            genre={song.genre}
                                            lyrics={song.lyrics}
                                        />
                                    ))
                                )}
                            </div>
                        </TabsContent>
                    ))}
                </Tabs>
            )}
        </div>
    );
};

export default SongListClient;