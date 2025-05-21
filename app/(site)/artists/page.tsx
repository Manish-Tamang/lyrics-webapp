import type { Metadata } from "next"
import { db } from "@/lib/firebase/config"
import { collection, getDocs, query, orderBy, where } from "firebase/firestore"
import ArtistCard from "@/components/artist-card"

export const metadata: Metadata = {
  title: "Artists | LyricVerse",
  description: "Browse all artists in our collection",
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

async function getArtists(): Promise<Artist[]> {
  try {
    const artistsQuery = query(collection(db, "artists"), orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(artistsQuery)

    const artistsData: Artist[] = []
    
    // Process each artist
    for (const doc of querySnapshot.docs) {
      const artistData = { id: doc.id, ...doc.data() } as Artist
      
      // Get songs for this artist
      const songsQuery = query(
        collection(db, "songs"),
        where("artist", "==", artistData.name)
      )
      const songsSnapshot = await getDocs(songsQuery)

      // Update artist data with actual counts
      artistData.stats = {
        songs: songsSnapshot.size
      }
      
      artistData.songCount = songsSnapshot.size

      if (!artistData.genres) {
        artistData.genres = []
      }

      artistsData.push(artistData)
    }

    return artistsData
  } catch (error) {
    console.error("Error fetching artists:", error)
    return []
  }
}

export default async function ArtistsPage() {
  const artists = await getArtists()

  return (
    <div className="space-y-8">
      <div className="border-b pb-6">
        <h1 className="text-3xl font-bold">Artists</h1>
        <p className="mt-2 text-muted-foreground">Discover artists and their lyrics in our collection.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {artists.map((artist) => (
          <ArtistCard
            key={artist.id}
            id={artist.id}
            name={artist.name}
            imageUrl={artist.imageUrl}
            genres={artist.genres}
            stats={artist.stats || { songs: 0 }}
          />
        ))}
      </div>
    </div>
  )
}

