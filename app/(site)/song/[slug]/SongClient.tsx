"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, Clock, Calendar, Disc } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import LyricsDisplay from "@/components/lyrics-display";
import RecentSongs from "@/components/recent-songs";
import { Song } from "@/types";
import { db } from "@/lib/firebase/config";
import { collection, getDocs, query, orderBy, limit, where, doc, getDoc } from "firebase/firestore";
import { format } from "date-fns";

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

interface Contributor {
    email: string;
    name: string;
    image: string;
}

const SongClient: React.FC<SongClientProps> = ({ song }) => {
    const [recentSongs, setRecentSongs] = useState<RecentSong[]>([]);
    const [loading, setLoading] = useState(true);
    const [contributors, setContributors] = useState<Contributor[]>([]);
    const [formattedDate, setFormattedDate] = useState<string>("");

    useEffect(() => {
        // Format the date when component mounts
        if (song.createdAt) {
            const date = new Date(song.createdAt.seconds * 1000);
            setFormattedDate(format(date, "MMM d, yyyy"));
        }

        // Fetch contributor details
        const fetchContributors = async () => {
            if (song.contributors && song.contributors.length > 0) {
                const contributorPromises = song.contributors.map(async (email) => {
                    const userDoc = await getDoc(doc(db, "users", email));
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        return {
                            email,
                            name: userData.name || email.split('@')[0],
                            image: userData.image || "",
                        };
                    }
                    return {
                        email,
                        name: email.split('@')[0],
                        image: "",
                    };
                });
                const contributorData = await Promise.all(contributorPromises);
                setContributors(contributorData);
            }
        };

        fetchContributors();

        const fetchRecentSongs = async () => {
            try {
                setLoading(true);
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
    }, [song.id, song.createdAt, song.contributors]);

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
            
            {/* Contributors Section */}
            {contributors.length > 0 && (
                <div className="mt-8">
                    <h3 className="mb-4 text-lg font-semibold">Contributors</h3>
                    <div className="flex flex-wrap gap-4">
                        {contributors.map((contributor) => (
                            <div key={contributor.email} className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={contributor.image} alt={contributor.name} />
                                    <AvatarFallback>{contributor.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm font-medium">{contributor.name}</p>
                                    <p className="text-xs text-muted-foreground">{contributor.email}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
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