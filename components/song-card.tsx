import Link from "next/link"
import Image from "next/image"
import { Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

interface SongCardProps {
  id: string
  title: string
  artist: string
  album?: string
  coverImage: string
  duration?: string
  genre?: string
}

export default function SongCard({ id, title, artist, album, coverImage, duration, genre }: SongCardProps) {
  return (
    <Link href={`/song/${id}`}>
      <Card className="group overflow-hidden rounded-[4px] transition-colors hover:border-primary">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={coverImage || "/placeholder.svg"}
            alt={`${title} by ${artist}`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="line-clamp-1 font-geist font-semibold group-hover:text-primary-foreground">{title}</h3>
          <p className="line-clamp-1 text-sm text-muted-foreground">{artist}</p>

          <div className="mt-3 flex items-center justify-between">
            {genre && (
              <Badge variant="outline" className="rounded-[4px]">
                {genre}
              </Badge>
            )}
            {duration && (
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="mr-1 h-3 w-3" />
                {duration}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

