import { songs } from "@/lib/data";
import { Avatar } from "@/components/ui/avatar";
import { ArrowLeft, Heart, Share2, Clock, Music2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function generateStaticParams() {
  return songs.map((song) => ({
    id: song.id,
  }));
}

export default function SongPage({
  params,
}: {
  params: { id: string };
}) {
  const song = songs.find((s) => s.id === params.id);

  if (!song) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Music2 className="h-16 w-16 mx-auto text-green-500 mb-4" />
        <h1 className="text-2xl font-bold mb-4">Song not found</h1>
        <Link href="/">
          <Button variant="outline" className="hover:text-green-500 hover:border-green-500 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to songs
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <Link href="/">
        <Button
          variant="ghost"
          className="mb-8 hover:text-green-500 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to songs
        </Button>
      </Link>

      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-transparent p-8 mb-12">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <Avatar className="w-40 h-40 rounded-lg border-4 border-green-500/10 shadow-xl">
              <img
                src={song.artistImage}
                alt={song.artist}
                className="object-cover"
              />
            </Avatar>
            <div className="text-center md:text-left flex-1">
              <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-green-500 to-emerald-600 text-transparent bg-clip-text">
                {song.title}
              </h1>
              <p className="text-2xl text-muted-foreground mb-4">{song.artist}</p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-6">
                <span className="text-sm text-muted-foreground px-4 py-1.5 bg-green-500/10 rounded-full flex items-center">
                  <Music2 className="h-3.5 w-3.5 mr-1.5" />
                  {song.album}
                </span>

              </div>
              <div className="flex items-center gap-4 justify-center md:justify-start">
                <Button variant="outline" size="sm" className="gap-2 hover:text-green-500 hover:border-green-500 transition-colors">
                  <Heart className="h-4 w-4" />
                  Save
                </Button>
                <Button variant="outline" size="sm" className="gap-2 hover:text-green-500 hover:border-green-500 transition-colors">
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Lyrics Section */}
        <div className="space-y-8 pb-16">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <h2 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-green-500 to-emerald-600 text-transparent bg-clip-text">
              Lyrics
            </h2>
            <div className="text-lg leading-relaxed whitespace-pre-line">
              {song.lyrics}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}