import type { Metadata } from "next"
import SongCard from "@/components/song-card"
import { songs } from "@/lib/data"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata: Metadata = {
  title: "All Songs | LyricVerse",
  description: "Browse all songs and lyrics in our collection",
}

export default function SongsPage() {
  // Group songs by genre
  const songsByGenre: Record<string, typeof songs> = {}

  songs.forEach((song) => {
    if (!songsByGenre[song.genre]) {
      songsByGenre[song.genre] = []
    }
    songsByGenre[song.genre].push(song)
  })

  const genres = Object.keys(songsByGenre)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">All Songs</h1>
        <p className="mt-2 text-muted-foreground">
          Browse our collection of song lyrics from various artists and genres.
        </p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6 w-full justify-start overflow-auto">
          <TabsTrigger value="all" className="rounded-[4px]">
            All
          </TabsTrigger>
          {genres.map((genre) => (
            <TabsTrigger key={genre} value={genre} className="rounded-[4px]">
              {genre}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="mt-0">
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {songs.map((song) => (
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
        </TabsContent>

        {genres.map((genre) => (
          <TabsContent key={genre} value={genre} className="mt-0">
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              {songsByGenre[genre].map((song) => (
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
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

