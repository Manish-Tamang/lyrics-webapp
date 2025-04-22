import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export const metadata: Metadata = {
  title: "About | LyricVerse",
  description: "Learn about LyricVerse and our mission to share lyrics and music information",
}

export default function AboutPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">About LyricVerse</h1>
        <p className="mt-2 text-muted-foreground">Our mission, story, and the people behind the lyrics.</p>
      </div>

      <div className="rounded-[4px] border bg-card p-6">
        <h2 className="text-2xl font-semibold">Our Mission</h2>
        <p className="mt-3 text-muted-foreground">
          LyricVerse was created with a simple mission: to provide a clean, minimalist platform for music lovers to
          discover, share, and appreciate song lyrics. We believe that lyrics are poetry set to music, and they deserve
          a dedicated space where they can be properly showcased and appreciated.
        </p>
        <p className="mt-3 text-muted-foreground">
          Our goal is to build a community of music enthusiasts who value the written word as much as the melody,
          creating a space where artists and fans can connect through the power of lyrics.
        </p>
      </div>
      <Image src={"/oil-paint.jpg"} className="rounded-[4px]" alt="about" width={800} height={500} />
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="rounded-[4px] border">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold">For Music Lovers</h3>
            <p className="mt-2 text-muted-foreground">
              Discover the meaning behind your favorite songs, explore new artists, and connect with a community that
              shares your passion for music and lyrics.
            </p>
            <ul className="mt-4 space-y-2 text-muted-foreground">
              <li>• Browse our extensive collection of lyrics</li>
              <li>• Discover new artists and genres</li>
              <li>• Save your favorite songs</li>
              <li>• Discuss interpretations with other fans</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="rounded-[4px] border">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold">For Artists</h3>
            <p className="mt-2 text-muted-foreground">
              Share your work with a dedicated audience, ensure your lyrics are accurately represented, and connect
              directly with fans who appreciate your songwriting.
            </p>
            <ul className="mt-4 space-y-2 text-muted-foreground">
              <li>• Submit and verify your own lyrics</li>
              <li>• Create an artist profile</li>
              <li>• Connect with your audience</li>
              <li>• Share the stories behind your songs</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-8" />

      <div>
        <h2 className="mb-6 text-2xl font-semibold">Our Team</h2>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {[
            {
              name: "Manish Tamang",
              role: "Developer",
              image: "https://www.manishtamang.com/profile.png",
            },
            {
              name: "Imohang Chamling Rai",
              role: "Moderator",
              image: "/imo.jpg",
            },
            {
              name: "Abish Karki",
              role: "Admin",
              image: "/abish.webp",
            },
          ].map((member) => (
            <div key={member.name} className="flex flex-col items-center text-center">
              <div className="relative h-32 w-32 overflow-hidden rounded-[4px]">
                <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
              </div>
              <h3 className="mt-4 text-lg font-karla">{member.name}</h3>
              <p className="text-sm text-primary-foreground">{member.role}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[4px] bg-primary p-6 text-center text-primary-foreground">
        <h2 className="text-xl font-semibold md:text-2xl">Join Our Community</h2>
        <p className="mx-auto mt-2 max-w-md">
          Become a part of LyricVerse and help us build the best platform for lyrics and music discovery.
        </p>
        <div className="mt-4 flex justify-center gap-3">
          <Button className="rounded-[4px] bg-white text-primary-foreground hover:bg-white/90">Sign Up Now</Button>
          <Button variant="outline" className="rounded-[4px] border-white bg-transparent text-white hover:bg-white/10">
            <Link href="/submit-lyrics">Contribute Lyrics</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

