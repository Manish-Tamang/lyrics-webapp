
import type { Metadata } from "next";
import { db } from "@/lib/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { Song } from "@/types";
import SongClient from "./SongClient";

interface SongPageProps {
  params: {
    slug: string; 
  };
}

export async function generateMetadata({ params }: SongPageProps): Promise<Metadata> {
  const songId = params.slug;

  try {
    const songDoc = await getDoc(doc(db, "songs", songId));
    if (songDoc.exists()) {
      const song = songDoc.data() as Song;
      return {
        title: `${song.title} by ${song.artist} | LyricVerse`,
        description: `View lyrics for ${song.title} by ${song.artist}`,
      };
    } else {
      return {
        title: "Song Not Found | LyricVerse",
      };
    }
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Error | LyricVerse",
      description: "Failed to generate metadata",
    };
  }
}

export default async function SongPage({ params }: SongPageProps) {
  const songId = params.slug;

  try {
    const songDoc = await getDoc(doc(db, "songs", songId));
    if (songDoc.exists()) {
      const song = { id: songDoc.id, ...songDoc.data() } as Song;
      return <SongClient song={song} />; 
    } else {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <h1 className="text-2xl font-bold">Song Not Found</h1>
          <p className="mt-2 text-muted-foreground">The song you're looking for doesn't exist or has been removed.</p>
        </div>
      );
    }
  } catch (error) {
    console.error("Error fetching song:", error);
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h1 className="text-2xl font-bold">Error</h1>
        <p className="mt-2 text-muted-foreground">Failed to load the song.</p>
      </div>
    );
  }
}