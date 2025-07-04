import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import SongCard from "@/components/song-card"
import RecentSongs from "@/components/recent-songs"
import { db } from "@/lib/firebase/config"
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore"

// Define the Song interface
interface Song {
  id: string
  title: string
  artist: string
  album?: string
  imageUrl?: string
  duration?: string
  genre?: string
  releaseDate?: string
  lyrics?: string
}

async function getRecentSongs(count = 4): Promise<Song[]> {
  try {
    const songsQuery = query(
      collection(db, "songs"),
      orderBy("createdAt", "desc"),
      limit(count)
    )
    const querySnapshot = await getDocs(songsQuery)

    const songs: Song[] = []
    querySnapshot.forEach((doc) => {
      const songData = { id: doc.id, ...doc.data() } as Song
      songs.push(songData)
    })

    return songs
  } catch (error) {
    console.error("Error fetching recent songs:", error)
    return []
  }
}

// Function to fetch popular songs from Firebase
async function getPopularSongs(count = 5): Promise<Song[]> {
  try {
    const songsQuery = query(
      collection(db, "songs"),
      orderBy("views", "desc"),
      limit(count)
    )
    const querySnapshot = await getDocs(songsQuery)

    const songs: Song[] = []
    querySnapshot.forEach((doc) => {
      const songData = { id: doc.id, ...doc.data() } as Song
      songs.push(songData)
    })

    return songs
  } catch (error) {
    console.error("Error fetching popular songs:", error)
    return []
  }
}

export default async function Home() {
  const recentSongs = await getRecentSongs(3)
  const popularSongs = await getPopularSongs(5)

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-[4px] bg-primary p-6 text-primary-foreground md:p-8">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold md:text-4xl">Largest Nepali Song Lyrics Bank</h1>
          <p className="mt-2 max-w-md text-primary-foreground/90 md:text-lg">
            Explore lyrics from your favorite artists and discover new music in a clean, minimalist interface.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button className="rounded-[4px] bg-white text-primary-foreground hover:bg-white/90">
              <Link href="/song">Browse Songs</Link>
            </Button>
            <Button
              variant="outline"
              className="rounded-[4px] border-white/10 bg-transparent text-bg-white/10 hover:bg-white/10"
            >
              <Link href="/artists">Explore Artists</Link>
            </Button>
          </div>
        </div>
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute -bottom-32 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
      </section>
      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Recent Songs</h2>
          <Link href="/song" className="flex items-center text-sm font-medium text-primary-foreground hover:underline">
            View all <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-6 grid-cols-2 md:grid-cols-3">
          {recentSongs.map((song) => (
            <SongCard
              key={song.id}
              id={song.id}
              title={song.title}
              artist={song.artist}
              album={song.album}
              coverImage={song.imageUrl || "/placeholder.svg"}
              duration={song.duration}
              genre={song.genre}
            />
          ))}
        </div>
      </section>
      <section>
        <RecentSongs 
          songs={popularSongs.map(song => ({
            id: song.id,
            title: song.title,
            artist: song.artist,
            coverImage: song.imageUrl || "/placeholder.svg"
          }))} 
          title="Popular Songs" 
          viewAllLink="/song" 
        />
      </section>
      <section className="rounded-[4px] bg-muted p-6 text-center">
        <h2 className="text-xl font-bold md:text-2xl">Join Our Community</h2>
        <p className="mx-auto mt-2 max-w-md text-muted-foreground">
          Connect with other music lovers, contribute lyrics, and stay updated on the latest releases.
        </p>
        <div className="mt-4 flex justify-center gap-3">
          <Button className="rounded-[4px]">Sign Up Now</Button>
          <Button variant="outline" className="rounded-[4px]">
            <Link href="/submit-lyrics">Submit Lyrics</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}

