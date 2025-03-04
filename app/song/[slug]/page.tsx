import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, Clock, Calendar, Disc } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import LyricsDisplay from "@/components/lyrics-display"
import RecentSongs from "@/components/recent-songs"
import { getSongBySlug, getArtistById, getArtistSongs } from "@/lib/data"

interface SongPageProps {
  params: {
    slug: string
  }
}

export function generateMetadata({ params }: SongPageProps): Metadata {
  const song = getSongBySlug(params.slug)

  if (!song) {
    return {
      title: "Song Not Found | LyricVerse",
    }
  }

  return {
    title: `${song.title} by ${song.artist} | LyricVerse`,
    description: `View lyrics for ${song.title} by ${song.artist}`,
  }
}

export default function SongPage({ params }: SongPageProps) {
  const song = getSongBySlug(params.slug)

  if (!song) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h1 className="text-2xl font-bold">Song Not Found</h1>
        <p className="mt-2 text-muted-foreground">The song you're looking for doesn't exist or has been removed.</p>
        <Button asChild className="mt-6 rounded-[4px]">
          <Link href="/song">Browse All Songs</Link>
        </Button>
      </div>
    )
  }

  const artist = getArtistById(song.artist.toLowerCase().replace(/\s+/g, "-"))
  const moreSongs = getArtistSongs(song.artist)
    .filter((s) => s.id !== song.id)
    .slice(0, 5)

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <div>
        <Button variant="ghost" size="sm" asChild className="rounded-[4px]">
          <Link href="/song" className="flex items-center">
            <ChevronLeft className="mr-1 h-4 w-4" /> Back to Songs
          </Link>
        </Button>
      </div>

      {/* Song Header */}
      <div className="flex flex-col gap-6 md:flex-row">
        <div className="relative aspect-square w-full overflow-hidden rounded-[4px] border md:w-48">
          <Image src={song.coverImage || "/placeholder.svg"} alt={song.title} fill className="object-cover" />
        </div>

        <div className="flex-1">
          <h1 className="text-3xl font-bold">{song.title}</h1>
          <Link href={`/artist/${artist?.id || "#"}`} className="mt-1 text-xl hover:text-primary-foreground">
            {song.artist}
          </Link>

          <div className="mt-4 flex flex-wrap gap-3">
            <Badge className="rounded-[4px]">{song.genre}</Badge>
            <div className="flex items-center text-sm text-muted-foreground">
              <Disc className="mr-1 h-4 w-4" />
              {song.album}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="mr-1 h-4 w-4" />
              {song.duration}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="mr-1 h-4 w-4" />
              {song.releaseDate}
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

      {/* Lyrics */}
      <LyricsDisplay lyrics={song.lyrics} contributors={song.contributors} />

      {/* More from Artist */}
      {moreSongs.length > 0 && (
        <RecentSongs
          songs={moreSongs}
          title={`More from ${song.artist}`}
          viewAllLink={`/artist/${artist?.id || "#"}`}
        />
      )}
    </div>
  )
}

