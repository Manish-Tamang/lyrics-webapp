"use client";

import SongCard from "@/components/song-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase/config";
import { collection, getDocs } from "firebase/firestore";
import { Song } from "@/types";

const SongListClient: React.FC = () => {
    const [songs, setSongs] = useState<Song[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSongs();
    }, []);

    const fetchSongs = async () => {
        setLoading(true);
        try {
            const querySnapshot = await getDocs(collection(db, "lyrics"));
            const songsData: Song[] = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Song[];
            setSongs(songsData);
        } catch (error) {
            console.error("Error fetching songs:", error);
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

            {loading ? (
                <p>Loading songs...</p>
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
                            {songs.map((song) => (
                                <SongCard
                                    key={song.id}
                                    id={song.id}
                                    title={song.songTitle}
                                    artist={song.artistName}
                                    album={song.albumName}
                                    coverImage={song.imageUrl || "/placeholder.svg"} 
                                    duration={song.duration}
                                    genre={song.genre}
                                />
                            ))}
                        </div>
                    </TabsContent>

                    {genres.map((genre) => (
                        <TabsContent key={genre} value={genre} className="mt-0">
                            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                                {songsByGenre[genre].map((song) => (
                                    <SongCard
                                        key={song.id}
                                        id={song.id}
                                        title={song.songTitle}
                                        artist={song.artistName}
                                        album={song.albumName}
                                        coverImage={song.imageUrl || "/placeholder.svg"}
                                        duration={song.duration}
                                        genre={song.genre}
                                    />
                                ))}
                            </div>
                        </TabsContent>
                    ))}
                </Tabs>
            )}
        </div>
    );
};

export default SongListClient;