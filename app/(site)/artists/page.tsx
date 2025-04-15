import type { Metadata } from "next"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { db } from "@/lib/firebase/config"
import { collection, getDocs, query, orderBy } from "firebase/firestore"
import { BlurImage } from "@/components/blur-image"

export const metadata: Metadata = {
  title: "Artists | LyricVerse",
  description: "Browse all artists in our collection",
}


interface Artist {
  id: string;
  name: string;
  bio: string;
  songCount: number;
  albumCount: number;
  imageUrl: string;
  genres?: string[];
  stats?: {
    songs: number;
    albums: number;
  };
}


async function getArtists(): Promise<Artist[]> {
  try {
    const artistsQuery = query(collection(db, "artists"), orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(artistsQuery)

    const artistsData: Artist[] = []
    querySnapshot.forEach((doc) => {
      const artistData = { id: doc.id, ...doc.data() } as Artist

      if (!artistData.genres) {
        artistData.genres = []
      }

      if (!artistData.stats) {
        artistData.stats = {
          songs: artistData.songCount || 0,
          albums: artistData.albumCount || 0
        }
      }

      if (artistData.songCount === undefined || artistData.songCount === null) {
        artistData.songCount = artistData.stats.songs || 0
      }

      artistsData.push(artistData)
    })

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
          <Link key={artist.id} href={`/artists/${artist.id}`}>
            <div className="group flex flex-col overflow-hidden rounded-lg border bg-card transition-all hover:shadow-md">
              <div className="relative aspect-square w-full overflow-hidden">
                <BlurImage
                  src={artist.imageUrl || "/placeholder.svg"}
                  alt={artist.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col p-4">
                <h3 className="font-semibold font-geist">{artist.name}</h3>
                <div className="mt-1 flex flex-wrap gap-1">
                  {artist.genres?.slice(0, 2).map((genre) => (
                    <Badge key={genre} variant="outline" className="rounded-md text-xs">
                      {genre}
                    </Badge>
                  ))}
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                  <div>{artist.stats?.songs || 0} songs</div>
                  <div>{artist.stats?.albums || 0} albums</div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

