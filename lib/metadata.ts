import { Metadata } from "next"
import { db } from "@/lib/firebase/config"
import { doc, getDoc } from "firebase/firestore"
import { Song } from "@/types"

export async function generateSongMetadata(slug: string): Promise<Metadata> {
  const songDoc = await getDoc(doc(db, "songs", slug))
  
  if (!songDoc.exists()) {
    return {
      title: "Song Not Found",
      description: "The requested song could not be found.",
    }
  }

  const song = songDoc.data() as Song

  // Only fetch artist data if artistId exists
  let artist = null
  if (song.artistId) {
    const artistDoc = await getDoc(doc(db, "artists", song.artistId))
    artist = artistDoc.exists() ? artistDoc.data() : null
  }

  const title = `${song.title} by ${song.artist} - Lyrics`
  const description = `Read the lyrics for ${song.title} by ${song.artist}. ${song.genre ? `Genre: ${song.genre}.` : ""}`
  const imageUrl = song.imageUrl || "/placeholder.svg"

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${song.title} album art`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: `https://lyricverse.com/song/${slug}`,
    },
  }
} 