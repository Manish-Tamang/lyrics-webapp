// Mock data for the lyrics website

export interface Song {
  id: string
  title: string
  artist: string
  album: string
  coverImage: string
  duration: string
  genre: string
  releaseDate: string
  lyrics: string
  contributors: string[]
}

export interface Artist {
  id: string
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

export const songs: Song[] = [
  {
    id: "cosmic-dreams",
    title: "Cosmic Dreams",
    artist: "Luna Eclipse",
    album: "Stellar Journeys",
    coverImage: "/placeholder.svg?height=400&width=400",
    duration: "3:42",
    genre: "Electronic",
    releaseDate: "2023-05-15",
    lyrics: `Floating through the cosmic void
Stardust in my veins
Nebulas of thought and time
Celestial refrains

Chorus:
Cosmic dreams, taking flight
Through the endless starry night
Cosmic dreams, burning bright
Guiding me with astral light

Gravity pulls me close to you
Orbiting your heart
Constellations map our path
Never to depart

(Repeat Chorus)

Bridge:
Supernovas in your eyes
Galaxies unfold
Universal energy
Stories yet untold

(Repeat Chorus)

Outro:
Drifting through the cosmic void
Stardust in my veins...`,
    contributors: ["Luna Eclipse", "Stellar Producer", "Cosmic Writer"],
  },
  {
    id: "urban-echoes",
    title: "Urban Echoes",
    artist: "Metro Pulse",
    album: "City Lights",
    coverImage: "/placeholder.svg?height=400&width=400",
    duration: "4:17",
    genre: "Hip Hop",
    releaseDate: "2023-08-22",
    lyrics: `Concrete jungle, steel and glass
Footsteps echo as I pass
Neon signs light up the night
City energy burning bright

Chorus:
Urban echoes, bouncing off the walls
Urban echoes, answering the calls
Of a million souls with a million dreams
Nothing's ever quite what it seems

Subway rumbles underneath my feet
Rhythm of the city, steady beat
Strangers passing, never meeting eyes
Under manufactured electric skies

(Repeat Chorus)

Bridge:
In this maze of stone and light
We're all searching day and night
For connection, for a spark
Something real amidst the dark

(Repeat Chorus)

Outro:
Concrete jungle, steel and glass
Footsteps echo as I pass...`,
    contributors: ["Metro Pulse", "Urban Producer", "City Writer"],
  },
  {
    id: "ocean-memories",
    title: "Ocean Memories",
    artist: "Coral Reef",
    album: "Tidal Waves",
    coverImage: "/placeholder.svg?height=400&width=400",
    duration: "3:56",
    genre: "Indie",
    releaseDate: "2023-06-30",
    lyrics: `Salt in the air, sand in my hair
Waves crashing without a care
Memories wash up on the shore
Moments I've lived, and moments before

Chorus:
Ocean memories, deep and blue
Ocean memories, washing over you
Tides of time that ebb and flow
Carrying me where I need to go

Seashells whisper secrets of old
Stories of love that never gets told
Horizon meets sky in perfect line
Boundary between yours and mine

(Repeat Chorus)

Bridge:
Beneath the surface, another world
Where hidden treasures lie unfurled
Dive deep into the mystery
Discover what you're meant to be

(Repeat Chorus)

Outro:
Salt in the air, sand in my hair
Waves crashing without a care...`,
    contributors: ["Coral Reef", "Wave Producer", "Beach Writer"],
  },
  {
    id: "mountain-whispers",
    title: "Mountain Whispers",
    artist: "Alpine Echo",
    album: "Summit",
    coverImage: "/placeholder.svg?height=400&width=400",
    duration: "5:12",
    genre: "Folk",
    releaseDate: "2023-02-10",
    lyrics: `Standing tall against the sky
Peaks that reach for clouds on high
Ancient stones with stories deep
Secrets that the mountains keep

Chorus:
Mountain whispers in the wind
Tales of where we've gone and been
Mountain whispers, soft and low
Wisdom only time can know

Forest paths and rushing streams
Reality beyond my dreams
Crisp air fills my lungs with life
Far from city stress and strife

(Repeat Chorus)

Bridge:
When I'm lost and feeling small
These giants help me stand up tall
Perspective shifts when I can see
The vastness of eternity

(Repeat Chorus)

Outro:
Standing tall against the sky
Peaks that reach for clouds on high...`,
    contributors: ["Alpine Echo", "Mountain Producer", "Trail Writer"],
  },
  {
    id: "digital-heartbeat",
    title: "Digital Heartbeat",
    artist: "Pixel Pulse",
    album: "Virtual Reality",
    coverImage: "/placeholder.svg?height=400&width=400",
    duration: "3:33",
    genre: "Electropop",
    releaseDate: "2023-11-05",
    lyrics: `Zeros and ones, binary code
Digital pathways where feelings flow
Connected yet distant in this modern age
Writing our story on a virtual page

Chorus:
Digital heartbeat, pulsing through the wire
Digital heartbeat, never seems to tire
Algorithms mapping what we feel inside
Nothing human ever truly dies

Screens light up faces in the dark
Each notification leaves its mark
Relationships formed through fiber optics
Love translated into new logistics

(Repeat Chorus)

Bridge:
Behind the screens and avatars
We're still just humans reaching for the stars
Seeking connection, trying to find
A way to truly share what's on our mind

(Repeat Chorus)

Outro:
Zeros and ones, binary code
Digital pathways where feelings flow...`,
    contributors: ["Pixel Pulse", "Tech Producer", "Digital Writer"],
  },
]

export const artists: Artist[] = [
  {
    id: "luna-eclipse",
    name: "Luna Eclipse",
    bio: "Luna Eclipse emerged from the underground electronic scene with a unique blend of ambient soundscapes and pulsing rhythms. Known for creating immersive sonic experiences that transport listeners to otherworldly realms, Luna's music often explores themes of space, time, and human consciousness. With three critically acclaimed albums and numerous collaborations with visual artists, Luna Eclipse continues to push the boundaries of electronic music.",
    image: "/placeholder.svg?height=400&width=400",
    genres: ["Electronic", "Ambient", "Downtempo"],
    stats: {
      songs: 42,
      albums: 3,
      followers: "245K",
    },
  },
  {
    id: "metro-pulse",
    name: "Metro Pulse",
    bio: "Metro Pulse is a hip-hop collective formed in the urban landscape of a bustling metropolis. Their music captures the energy, struggles, and triumphs of city life through sharp lyrics and innovative beats. Drawing inspiration from both classic hip-hop and modern production techniques, Metro Pulse creates tracks that resonate with listeners across generations. Their authentic storytelling and community engagement have earned them a dedicated following in the underground scene.",
    image: "/placeholder.svg?height=400&width=400",
    genres: ["Hip Hop", "Urban", "Alternative Rap"],
    stats: {
      songs: 37,
      albums: 2,
      followers: "189K",
    },
  },
  {
    id: "coral-reef",
    name: "Coral Reef",
    bio: "Coral Reef is an indie band known for their dreamy melodies and introspective lyrics that often draw parallels between human emotions and natural phenomena. Formed during college years at a coastal town, their music evokes the ebb and flow of ocean tides and the tranquility of seaside contemplation. With a distinctive sound that blends acoustic instruments with subtle electronic elements, Coral Reef has cultivated a devoted following that appreciates their authentic approach to songwriting.",
    image: "/placeholder.svg?height=400&width=400",
    genres: ["Indie", "Dream Pop", "Alternative"],
    stats: {
      songs: 28,
      albums: 2,
      followers: "156K",
    },
  },
  {
    id: "alpine-echo",
    name: "Alpine Echo",
    bio: "Alpine Echo brings the timeless traditions of folk music into the contemporary landscape with their heartfelt compositions and masterful instrumentation. Inspired by mountain landscapes and rural life, their songs tell stories of human connection to nature and the passing of generations. The band's harmonious vocals and acoustic arrangements create an intimate atmosphere that resonates with listeners seeking authenticity in an increasingly digital world.",
    image: "/placeholder.svg?height=400&width=400",
    genres: ["Folk", "Acoustic", "Americana"],
    stats: {
      songs: 45,
      albums: 4,
      followers: "210K",
    },
  },
  {
    id: "pixel-pulse",
    name: "Pixel Pulse",
    bio: "Pixel Pulse emerged at the intersection of technology and music, creating electropop anthems that explore the relationship between humans and the digital world. With catchy hooks layered over innovative electronic production, their songs capture both the excitement and anxiety of modern connected life. The artist behind Pixel Pulse maintains a mysterious online persona, allowing the music to speak for itself while commenting on themes of identity in the digital age.",
    image: "/placeholder.svg?height=400&width=400",
    genres: ["Electropop", "Synthwave", "Future Pop"],
    stats: {
      songs: 23,
      albums: 1,
      followers: "178K",
    },
  },
]

export function getSongBySlug(slug: string): Song | undefined {
  return songs.find((song) => song.id === slug)
}

export function getArtistById(id: string): Artist | undefined {
  return artists.find((artist) => artist.id === id)
}

export function getArtistSongs(artistName: string): Song[] {
  return songs.filter((song) => song.artist === artistName)
}

export function getRecentSongs(count = 5): Song[] {
  return songs.slice(0, count)
}

export function getPopularSongs(count = 5): Song[] {
  // In a real app, this would be based on play count or other metrics
  return [...songs].sort(() => 0.5 - Math.random()).slice(0, count)
}

export function getSongsByGenre(genre: string): Song[] {
  return songs.filter((song) => song.genre.toLowerCase() === genre.toLowerCase())
}

