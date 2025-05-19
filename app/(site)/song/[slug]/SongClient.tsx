"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, Clock, Calendar, Disc, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Song } from "@/types";
import { db } from "@/lib/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Timestamp } from "firebase/firestore";
import LyricsDisplay from "@/components/lyrics-display";
import ViewCounter from "@/components/view-counter";
import { PageAutoScroll } from "@/components/lyrics-auto-scroll";

interface SongClientProps {
  slug: string;
}

interface Contributor {
  name: string;
  email: string;
  imageUrl?: string;
}

export default function SongClient({ slug }: SongClientProps) {
  const [song, setSong] = useState<Song | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formattedDate, setFormattedDate] = useState<string>("");
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const lyricsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchSong = async () => {
      try {
        const songDoc = await getDoc(doc(db, "songs", slug));
        if (songDoc.exists()) {
          const songData = { id: songDoc.id, ...songDoc.data() } as Song;
          setSong(songData);

          if (songData.contributors) {
            const contributorPromises = songData.contributors.map(
              async (email) => {
                const userDoc = await getDoc(doc(db, "users", email));
                if (userDoc.exists()) {
                  const userData = userDoc.data();
                  return {
                    name: userData.name || email.split("@")[0],
                    email,
                    imageUrl: userData.image,
                  };
                }
                return {
                  name: email.split("@")[0],
                  email,
                  imageUrl: undefined,
                };
              }
            );
            const contributorData = await Promise.all(contributorPromises);
            setContributors(contributorData);
          }

          if (songData.createdAt) {
            const date =
              songData.createdAt instanceof Timestamp
                ? songData.createdAt.toDate()
                : new Date(songData.createdAt);
            setFormattedDate(format(date, "MMM d, yyyy"));
          }
        } else {
          setError("Song not found");
        }
      } catch (err) {
        console.error("Error fetching song:", err);
        setError("Failed to load song");
      } finally {
        setLoading(false);
      }
    };

    fetchSong();
  }, [slug]);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild className="rounded-[4px]">
            <Link href="/song" className="flex items-center">
              <ChevronLeft className="mr-1 h-4 w-4" /> Back to Songs
            </Link>
          </Button>
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="grid gap-6">
          <Skeleton className="aspect-square w-full rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !song) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h2 className="text-2xl font-bold mb-4">Song Not Found</h2>
        <p className="text-gray-600 mb-6">Could not find the requested song.</p>
        <Image
          src="/404.png"
          alt="Illustration for song not found page"
          width={500} 
          height={300}
          objectFit="contain"
          draggable="false"
          style={{ userSelect: "none" }}
        />
        <Link href="/song" className="mt-8 text-blue-500 hover:underline">
          Return to Songs List
        </Link>
      </div>
    );
  }

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
          <Image
            src={song.imageUrl || "/placeholder.svg"}
            alt={song.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{song.title}</h1>
          <p className="mt-1 text-xl">{song.artist}</p>
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
            <div className="flex items-center text-sm text-muted-foreground">
              <Eye className="mr-1 h-4 w-4" />
              <ViewCounter slug={song.id} />
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <Button className="rounded-[4px]">Play Song</Button>
            <Button variant="outline" className="rounded-[4px]">
              Share
            </Button>
          </div>
        </div>
      </div>
      <div className="prose max-w-none" ref={lyricsContainerRef}>
        <LyricsDisplay lyrics={song.lyrics} />
      </div>
      <PageAutoScroll />

      {contributors.length > 0 && (
        <div className="mt-8">
          <h3 className="mb-4 text-lg font-semibold">Contributors</h3>
          <div className="flex flex-wrap gap-4">
            {contributors.map((contributor) => (
              <div key={contributor.email} className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={contributor.imageUrl}
                    alt={contributor.name}
                  />
                  <AvatarFallback>{contributor.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{contributor.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {formattedDate && (
        <p className="text-sm text-muted-foreground">
          Added on {formattedDate}
        </p>
      )}
    </div>
  );
}
