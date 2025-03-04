import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { artists } from "@/lib/data"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "Artists | LyricVerse",
  description: "Browse all artists in our collection",
}

export default function ArtistsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Artists</h1>
        <p className="mt-2 text-muted-foreground">Discover artists and their lyrics in our collection.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {artists.map((artist) => (
          <Link key={artist.id} href={`/artists/${artist.id}`}>
            <div className="group flex overflow-hidden rounded-[4px] border bg-card transition-all hover:shadow-md">
              <div className="relative h-24 w-24 shrink-0 overflow-hidden sm:h-32 sm:w-32">
                <Image
                  src={artist.image || "/placeholder.svg"}
                  alt={artist.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col justify-between p-4">
                <div>
                  <h3 className="font-semibold group-hover:text-primary-foreground">{artist.name}</h3>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {artist.genres.slice(0, 2).map((genre) => (
                      <Badge key={genre} variant="outline" className="rounded-[4px] text-xs">
                        {genre}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">{artist.stats.songs} songs</div>
                  <div className="text-xs text-muted-foreground">{artist.stats.followers} followers</div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

