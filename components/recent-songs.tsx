import Link from "next/link"
import Image from "next/image"
import { ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

interface Song {
  id: string
  title: string
  artist: string
  coverImage: string
}

interface RecentSongsProps {
  songs: Song[]
  title?: string
  viewAllLink?: string
}

export default function RecentSongs({ songs, title = "Recent Songs", viewAllLink = "/song" }: RecentSongsProps) {
  return (
    <Card className="rounded-[4px]">
      <CardHeader className="flex flex-row items-center justify-between border-b p-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        {viewAllLink && (
          <Link
            href={viewAllLink}
            className="flex items-center text-sm font-medium text-primary-foreground hover:underline"
          >
            View all <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        )}
      </CardHeader>

      <CardContent className="p-0">
        <div className="divide-y">
          {songs.map((song) => (
            <Link key={song.id} href={`/song/${song.id}`}>
              <div className="flex items-center gap-3 p-3 hover:bg-muted/50">
                <div className="relative h-12 w-12 overflow-hidden rounded-[4px]">
                  <Image src={song.coverImage || "/placeholder.svg"} alt={song.title} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="line-clamp-1 font-medium">{song.title}</h3>
                  <p className="line-clamp-1 text-sm text-muted-foreground">{song.artist}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

