"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "@/lib/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { Song } from "@/types";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, Globe } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function SongDetailPage() {
  const params = useParams();
  const [song, setSong] = useState<Song | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSong = async () => {
      if (!params.id) return;
      
      try {
        setLoading(true);
        const songDoc = await getDoc(doc(db, "songs", params.id as string));
        
        if (songDoc.exists()) {
          setSong({ id: songDoc.id, ...songDoc.data() } as Song);
        }
      } catch (error) {
        console.error("Error fetching song:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSong();
  }, [params.id]);

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <Skeleton className="aspect-square w-full rounded-md" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-20" />
            </div>
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!song) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold">Song not found</h1>
        <p className="mt-2">The song you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <div className="relative aspect-square overflow-hidden rounded-md">
            <Image
              src={song.imageUrl || "/placeholder.svg"}
              alt={`${song.title} by ${song.artist}`}
              fill
              className="object-cover"
            />
          </div>
        </div>
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{song.title}</h1>
          <p className="text-xl text-muted-foreground">{song.artist}</p>
          
          <div className="flex flex-wrap gap-2">
            {song.genre && (
              <Badge variant="outline" className="rounded-[4px]">
                {song.genre}
              </Badge>
            )}
            {song.language && (
              <Badge variant="outline" className="rounded-[4px]">
                {song.language}
              </Badge>
            )}
          </div>
          
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {song.album && (
              <div className="flex items-center">
                <span className="mr-1">Album:</span>
                <span>{song.album}</span>
              </div>
            )}
            {song.releaseDate && (
              <div className="flex items-center">
                <Calendar className="mr-1 h-4 w-4" />
                <span>{song.releaseDate}</span>
              </div>
            )}
            {song.duration && (
              <div className="flex items-center">
                <Clock className="mr-1 h-4 w-4" />
                <span>{song.duration}</span>
              </div>
            )}
            {song.views !== undefined && (
              <div className="flex items-center">
                <Globe className="mr-1 h-4 w-4" />
                <span>{song.views.toLocaleString()} views</span>
              </div>
            )}
          </div>
          
          <div className="mt-6">
            <h2 className="mb-2 text-xl font-semibold">Lyrics</h2>
            <div className="whitespace-pre-line rounded-md border p-4 text-sm">
              {song.lyrics || "No lyrics available"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 