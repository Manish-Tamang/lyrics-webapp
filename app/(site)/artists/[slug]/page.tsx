import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ArtistInfo from "@/components/artist-info";
import SongCard from "@/components/song-card";
import { db } from "@/lib/firebase/config";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { BlurImage } from "@/components/blur-image";

interface ArtistPageProps {
  params: {
    slug: string;
  };
}

interface Artist {
  id: string;
  name: string;
  bio: string;
  songCount: number;
  imageUrl: string;
  genres?: string[];
  stats?: {
    songs: number;
  };
}

interface Song {
  id: string;
  title: string;
  artist: string;
  imageUrl: string;
  duration: string;
  genre: string;
}

export async function generateMetadata({
  params,
}: ArtistPageProps): Promise<Metadata> {
  const artist = await getArtistById(params.slug);

  if (!artist) {
    return {
      title: "Artist Not Found | LyricVerse",
    };
  }

  return {
    title: `${artist.name} | LyricVerse`,
    description: `View songs and information about ${artist.name}`,
  };
}

async function getArtistById(id: string): Promise<Artist | null> {
  try {
    const artistDoc = await getDoc(doc(db, "artists", id));

    if (!artistDoc.exists()) {
      return null;
    }

    const artistData = { id: artistDoc.id, ...artistDoc.data() } as Artist;

    if (!artistData.genres) {
      artistData.genres = [];
    }

    if (!artistData.stats) {
      artistData.stats = {
        songs: artistData.songCount || 0,
      };
    }

    return artistData;
  } catch (error) {
    console.error("Error fetching artist:", error);
    return null;
  }
}

async function getArtistSongs(artistName: string): Promise<Song[]> {
  try {
    const songsQuery = query(
      collection(db, "songs"),
      where("artist", "==", artistName)
    );
    const querySnapshot = await getDocs(songsQuery);

    const songs: Song[] = [];
    querySnapshot.forEach((doc) => {
      const songData = { id: doc.id, ...doc.data() } as Song;
      songs.push(songData);
    });

    return songs;
  } catch (error) {
    console.error("Error fetching artist songs:", error);
    return [];
  }
}

export default async function ArtistPage({ params }: ArtistPageProps) {
  const artist = await getArtistById(params.slug);

  if (!artist) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h2 className="text-2xl font-bold mb-4">Artist Not Found</h2>
        <p className="text-gray-600 mb-6">Could not find the requested artist.</p>
        <Image
          src="/404.png"
          alt="Illustration for artist not found page"
          width={500} 
          height={300}
          objectFit="contain"
          draggable="false"
          style={{ userSelect: "none" }}
        />
        <Link href="/artists" className="mt-8 text-blue-500 hover:underline">
          Return to Artists List
        </Link>
      </div>
    );
  }

  const artistSongs = await getArtistSongs(artist.name);

  const updatedArtist = {
    ...artist,
    stats: {
      ...artist.stats,
      songs: artistSongs.length,
    },
  };

  try {
    await updateDoc(doc(db, "artists", artist.id), {
      songCount: artistSongs.length,
      stats: {
        ...artist.stats,
        songs: artistSongs.length,
      },
    });
  } catch (error) {
    console.error("Error updating artist song count:", error);
  }

  return (
    <div className="space-y-8">
      <div>
        <Button variant="ghost" size="sm" asChild className="rounded-[4px]">
          <Link href="/artists" className="flex items-center">
            <ChevronLeft className="mr-1 h-4 w-4" /> Back to Artists
          </Link>
        </Button>
      </div>

      <ArtistInfo
        name={updatedArtist.name}
        bio={updatedArtist.bio}
        image={updatedArtist.imageUrl}
        genres={updatedArtist.genres || []}
        stats={{
          songs: updatedArtist.stats?.songs || 0,
        }}
      />

      <div>
        <h2 className="mb-6 text-2xl font-bold">
          Songs by {updatedArtist.name} ({artistSongs.length})
        </h2>

        {artistSongs.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {artistSongs.map((song) => (
              <div
                key={song.id}
                className="group overflow-hidden rounded-lg border bg-card transition-all hover:shadow-md"
              >
                <div className="relative aspect-square w-full overflow-hidden">
                  <BlurImage
                    src={song.imageUrl || "/placeholder.svg"}
                    alt={song.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold">{song.title}</h3>
                  <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                    <div>{song.duration}</div>
                    <div>{song.genre}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">
            No songs found for this artist.
          </p>
        )}
      </div>
    </div>
  );
}
