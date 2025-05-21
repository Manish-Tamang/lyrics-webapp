"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { BlurImage } from "@/components/blur-image"

interface ArtistCardProps {
  id: string
  name: string
  imageUrl: string
  genres?: string[]
  stats: {
    songs: number
  }
}

export default function ArtistCard({ id, name, imageUrl, genres, stats }: ArtistCardProps) {
  return (
    <Link href={`/artists/${id}`}>
      <div className="group flex flex-col overflow-hidden rounded-lg border bg-card transition-all hover:shadow-md">
        <div className="relative aspect-square w-full overflow-hidden">
          <BlurImage
            src={imageUrl || "/placeholder.svg"}
            alt={name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="flex flex-1 flex-col p-4">
          <h3 className="font-semibold font-geist">{name}</h3>
          <div className="mt-1 flex flex-wrap gap-1">
            {genres?.slice(0, 2).map((genre) => (
              <Badge key={genre} variant="outline" className="rounded-md text-xs">
                {genre}
              </Badge>
            ))}
          </div>
          <div className="mt-3 text-xs text-muted-foreground">
            {stats.songs} songs
          </div>
        </div>
      </div>
    </Link>
  )
} 