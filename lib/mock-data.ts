export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  coverImage: string;
  duration: string;
  genre: string;
  releaseDate: string;
  lyrics: string;
  contributors: string[];
}

export interface Artist {
  id: string;
  name: string;
  bio: string;
  image: string;
  genres: string[];
  stats: {
    songs: number;
    albums: number;
    followers: string;
  };
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
  // Yabesh Thapa Songs
  {
    id: "laakhau-hajarau",
    title: "Laakhau Hajarau",
    artist: "Yabesh Thapa",
    album: "Single",
    coverImage:
      "https://images.genius.com/074ed88dbf0f5903a962da612c1480b9.1000x1000x1.jpg", // Example from YouTube thumbnail
    duration: "4:05",
    genre: "Indie Pop",
    releaseDate: "2019-06-01", // Approximate based on debut info
    lyrics: `Timro tyo muskan le
Malai aafnai banaucha
Laakhau hajarau madhye
Timilai nai khojcha

Chorus:
Timro lagi yo man
Dhadkancha harpal
Timilai dekhera
Yo jiwan bancha safal

Haat samaayera
Sangai hidne chu
Timro aankhama
Aafailai dekhne chu

(Repeat Chorus)

Bridge:
Timro saath paye
Yo sansar sundar lagcha
Har kadam ma timi
Mero sathi bancha

(Repeat Chorus)

Outro:
Timro tyo muskan le
Malai aafnai banaucha...`,
    contributors: ["Yabesh Thapa", "Class X Presentation"],
  },
  {
    id: "angalney-chu",
    title: "Angalney Chu",
    artist: "Yabesh Thapa",
    album: "Single",
    coverImage: "https://i.ytimg.com/vi/4rW19BlyPZA/maxresdefault.jpg", // Example from YouTube thumbnail
    duration: "3:48",
    genre: "Indie Acoustic",
    releaseDate: "2020-03-15", // Approximate
    lyrics: `Timro aankha ma baseko
Sapana haru dekhe
Angalney chu timilai
Dil ma rakhe

Chorus:
Timilai samjhera
Yo man le bolcha
Har raat timrai
Kalpana ma dolcha

Timi bina yo jiwan
Adhuro lagcha
Timro saath le
Sabai thik huncha

(Repeat Chorus)

Bridge:
Timro haat samayera
Sangai bitaune chu
Timro maya le
Yo dil chune chu

(Repeat Chorus)

Outro:
Timro aankha ma baseko
Sapana haru dekhe...`,
    contributors: ["Yabesh Thapa"],
  },
  {
    id: "firfirey",
    title: "Firfirey",
    artist: "Yabesh Thapa",
    album: "Single",
    coverImage:
      "https://i0.wp.com/www.nepalitrends.com/wp-content/uploads/2020/09/Yabesh-thapa.jpg?fit=724%2C720&ssl=1", // Example from YouTube thumbnail
    duration: "3:35",
    genre: "Indie Pop",
    releaseDate: "2021-04-09",
    lyrics: `Yo hawa lai sodhihera
Yo aakash lai pani thaha cha
Din bitigo maya tara
Raat chadai cha ni

Chorus:
Firfirey yo man
Timro lagi dhadkancha
Timilai samjhera
Yo dil nachancha

Timro boli sunera
Yo jiwan rangincha
Timro saath paye
Sabai thik huncha

(Repeat Chorus)

Bridge:
Timro muskan le
Yo sansar roshancha
Har pal timrai
Yaad ma bitancha

(Repeat Chorus)

Outro:
Yo hawa lai sodhihera
Yo aakash lai pani thaha cha...`,
    contributors: ["Yabesh Thapa"],
  },
  {
    id: "alapatra",
    title: "Alapatra",
    artist: "Yabesh Thapa",
    album: "Single",
    coverImage: "https://i.ytimg.com/vi/_zZ5nO8L5zM/maxresdefault.jpg", // Example from YouTube thumbnail
    duration: "4:12",
    genre: "Indie Pop",
    releaseDate: "2023-10-20", // Approximate based on recent release mentions
    lyrics: `Alapatra yo man
Timro lagi khojdai cha
Timilai bhetna
Har din bitaudai cha

Chorus:
Timro maya ko rang
Yo dil ma baseko cha
Timilai samjhera
Yo man udeko cha

Timro saath le
Yo jiwan sundar cha
Timro aankha ma
Mero sansar cha

(Repeat Chorus)

Bridge:
Timro baato ma
Har kadam chaldai chu
Timro lagi yo
Sapana dekhdai chu

(Repeat Chorus)

Outro:
Alapatra yo man
Timro lagi khojdai cha...`,
    contributors: ["Yabesh Thapa"],
  },
];

export const artists: Artist[] = [
  {
    id: "jpt-rockerz",
    name: "Jpt Rockerz",
    bio: "Luna Eclipse emerged from the underground electronic scene with a unique blend of ambient soundscapes and pulsing rhythms. Known for creating immersive sonic experiences that transport listeners to otherworldly realms, Luna's music often explores themes of space, time, and human consciousness. With three critically acclaimed albums and numerous collaborations with visual artists, Luna Eclipse continues to push the boundaries of electronic music.",
    image: "/artist/jptrockerz/jptrockerz.jpeg",
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
  {
    id: "yabesh-thapa",
    name: "Yabesh Thapa",
    bio: "Yabesh Thapa is a Nepali singer-songwriter and producer who has taken the indie music scene by storm with his soulful voice and heartfelt lyrics. Hailing from Kathmandu, Nepal, Yabesh blends indie pop and acoustic elements to create music that resonates deeply with listeners. Known for hits like 'Laakhau Hajarau' and 'Firfirey,' he explores themes of love, longing, and personal growth. His authentic storytelling and melodic compositions have earned him a growing fanbase both in Nepal and internationally.",
    image:
      "https://i0.wp.com/www.nepalitrends.com/wp-content/uploads/2020/09/Yabesh-thapa.jpg?fit=724%2C720&ssl=1", // Using a consistent image from a song cover
    genres: ["Acoustic", "Pop"],
    stats: {
      songs: 21, // Based on known discography mentions
      albums: 0, // Mostly singles, no full album yet
      followers: "358K", // Spotify monthly listeners as a proxy
    },
  },
];

export function getSongBySlug(slug: string): Song | undefined {
  return songs.find((song) => song.id === slug);
}

export function getArtistById(id: string): Artist | undefined {
  return artists.find((artist) => artist.id === id);
}

export function getArtistSongs(artistName: string): Song[] {
  return songs.filter((song) => song.artist === artistName);
}

export function getRecentSongs(count = 5): Song[] {
  return songs.slice(0, count);
}

export function getPopularSongs(count = 5): Song[] {
  return [...songs].sort(() => 0.5 - Math.random()).slice(0, count);
}

export function getSongsByGenre(genre: string): Song[] {
  return songs.filter(
    (song) => song.genre.toLowerCase() === genre.toLowerCase()
  );
}
