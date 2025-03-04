import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

interface ArtistInfoProps {
  name: string
  bio: string
  image: string
  genres: string[]
  stats: {
    songs: number
    albums: number
    followers: string
  }
}

export default function ArtistInfo({ name, bio, image, genres, stats }: ArtistInfoProps) {
  return (
    <Card className="rounded-[4px]">
      <CardContent className="p-6">
        <div className="flex flex-col items-center gap-6 md:flex-row">
          <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-primary md:h-40 md:w-40">
            <Image src={image || "/placeholder.svg"} alt={name} fill className="object-cover" />
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-bold md:text-3xl">{name}</h1>

            <div className="mt-2 flex flex-wrap justify-center gap-2 md:justify-start">
              {genres.map((genre) => (
                <Badge key={genre} variant="secondary" className="rounded-[4px]">
                  {genre}
                </Badge>
              ))}
            </div>

            <div className="mt-4 flex justify-center gap-6 text-sm md:justify-start">
              <div>
                <p className="font-semibold">{stats.songs}</p>
                <p className="text-muted-foreground">Songs</p>
              </div>
              <div>
                <p className="font-semibold">{stats.albums}</p>
                <p className="text-muted-foreground">Albums</p>
              </div>
              <div>
                <p className="font-semibold">{stats.followers}</p>
                <p className="text-muted-foreground">Followers</p>
              </div>
            </div>

            <div className="mt-4 flex justify-center gap-3 md:justify-start">
              <Button className="rounded-[4px]">Follow</Button>
              <Button variant="outline" className="rounded-[4px]">
                Share
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="mb-2 text-lg font-semibold">About</h2>
          <p className="text-muted-foreground">{bio}</p>
        </div>
      </CardContent>
    </Card>
  )
}

