import type { Metadata } from "next"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import ArtistInfo from "@/components/artist-info"
import SongCard from "@/components/song-card"
import { getArtistById, getArtistSongs } from "@/lib/data"

interface ArtistPageProps {
  params: {
    slug: string
  }
}

export function generateMetadata({ params }: ArtistPageProps): Metadata {
  const artist = getArtistById(params.slug)

  if (!artist) {
    return {
      title: "Artist Not Found | LyricVerse",
    }
  }

  return {
    title: `${artist.name} | LyricVerse`,
    description: `View songs and information about ${artist.name}`,
  }
}

export default function ArtistPage({ params }: ArtistPageProps) {
  const artist = getArtistById(params.slug)

  if (!artist) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h1 className="text-2xl font-bold">Artist Not Found</h1>
        <p className="mt-2 text-muted-foreground">The artist you're looking for doesn't exist or has been removed.</p>
        <Button asChild className="mt-6 rounded-[4px]">
          <Link href="/artists">Browse All Artists</Link>
        </Button>
      </div>
    )
  }

  const artistSongs = getArtistSongs(artist.name)

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <div>
        <Button variant="ghost" size="sm" asChild className="rounded-[4px]">
          <Link href="/artists" className="flex items-center">
            <ChevronLeft className="mr-1 h-4 w-4" /> Back to Artists
          </Link>
        </Button>
      </div>

      {/* Artist Info */}
      <ArtistInfo
        name={artist.name}
        bio={artist.bio}
        image={artist.image}
        genres={artist.genres}
        stats={artist.stats}
      />

      {/* Artist Songs */}
      <div>
        <h2 className="mb-6 text-2xl font-bold">Songs by {artist.name}</h2>

        {artistSongs.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {artistSongs.map((song) => (
              <SongCard
                key={song.id}
                id={song.id}
                title={song.title}
                artist={song.artist}
                album={song.album}
                coverImage={song.coverImage}
                duration={song.duration}
                genre={song.genre}
              />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No songs found for this artist.</p>
        )}
      </div>
    </div>
  )
}

