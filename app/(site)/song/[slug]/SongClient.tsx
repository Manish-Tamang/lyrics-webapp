"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, Clock, Calendar, Disc } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import LyricsDisplay from "@/components/lyrics-display";
import RecentSongs from "@/components/recent-songs";
import { Song } from "@/types";
import { db } from "@/lib/firebase/config";
import { collection, getDocs, query, orderBy, limit, where } from "firebase/firestore";

interface SongClientProps {
    song: Song;
}

// Define the RecentSong interface
interface RecentSong {
    id: string;
    title: string;
    artist: string;
    coverImage: string;
}

const SongClient: React.FC<SongClientProps> = ({ song }) => {
    const [recentSongs, setRecentSongs] = useState<RecentSong[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecentSongs = async () => {
            try {
                setLoading(true);
                // Fetch 5 recent songs, excluding the current song
                const songsQuery = query(
                    collection(db, "songs"),
                    where("id", "!=", song.id),
                    orderBy("id"),
                    orderBy("createdAt", "desc"),
                    limit(5)
                );
                
                const querySnapshot = await getDocs(songsQuery);
                const songs: RecentSong[] = [];
                
                querySnapshot.forEach((doc) => {
                    const songData = doc.data();
                    songs.push({
                        id: doc.id,
                        title: songData.title,
                        artist: songData.artist,
                        coverImage: songData.imageUrl || "/placeholder.svg"
                    });
                });
                
                setRecentSongs(songs);
            } catch (error) {
                console.error("Error fetching recent songs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecentSongs();
    }, [song.id]);

    return (
        <div className="space-y-8">
            <div>
                <Button variant="ghost" size="sm" asChild className="rounded-[4px]">
                    <Link href="/song" className="flex items-center">
                        <ChevronLeft className="mr-1 h-4 w-4" /> Back to Songs
                    </Link>
                </Button>
            </div>
            <div className="flex flex-col gap-6 md:flex-row">
                <div className="relative aspect-square w-full overflow-hidden rounded-[4px] border md:w-48">
                    <Image src={song.imageUrl || "/placeholder.svg"} alt={song.title} fill className="object-cover" />
                </div>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold">{song.title}</h1>
                    <p className="mt-1 text-xl">
                        {song.artist}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3">
                        <Badge className="rounded-[4px]">{song.genre}</Badge>
                        {song.album && (
                            <div className="flex items-center text-sm text-muted-foreground">
                                <Disc className="mr-1 h-4 w-4" />
                                {song.album}
                            </div>
                        )}
                        {song.duration && (
                            <div className="flex items-center text-sm text-muted-foreground">
                                <Clock className="mr-1 h-4 w-4" />
                                {song.duration}
                            </div>
                        )}
                        {song.releaseDate && (
                            <div className="flex items-center text-sm text-muted-foreground">
                                <Calendar className="mr-1 h-4 w-4" />
                                {song.releaseDate}
                            </div>
                        )}
                    </div>
                    <div className="mt-6 flex gap-3">
                        <Button className="rounded-[4px]">Play Song</Button>
                        <Button variant="outline" className="rounded-[4px]">
                            Share
                        </Button>
                    </div>
                </div>
            </div>
            <LyricsDisplay lyrics={song.lyrics} />
            
            {!loading && recentSongs.length > 0 && (
                <div className="mt-8">
                    <h2 className="mb-4 text-2xl font-bold">More Songs</h2>
                    <RecentSongs songs={recentSongs} title="" viewAllLink="" />
                </div>
            )}
        </div>
    );
};

export default SongClient;