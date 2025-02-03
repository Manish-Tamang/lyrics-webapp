import Link from "next/link";
import { Card } from "@/components/ui/card";
import { songs } from "@/lib/data";
import { Music2, Play, Clock, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function SongList() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {songs.map((song) => (
        <Link
          key={song.id}
          href={`/songs/${song.id}`}
          className="block group"
          onMouseEnter={() => setHoveredId(song.id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          <Card className="p-6 transition-all duration-300 hover:shadow-[0_0_15px_rgba(34,197,94,0.2)] relative overflow-hidden bg-card">
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="flex items-start gap-4 relative">
              <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-green-500/10 to-emerald-600/10 flex items-center justify-center group-hover:from-green-500/20 group-hover:to-emerald-600/20 transition-all duration-300">
                <Music2
                  className={`h-8 w-8 text-green-500 transition-transform duration-300 ${hoveredId === song.id ? 'scale-110' : ''
                    }`}
                />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h2 className="font-semibold text-xl bg-gradient-to-r from-green-500 to-emerald-600 text-transparent bg-clip-text">
                    {song.title}
                  </h2>
                  <Heart className="h-4 w-4 text-muted-foreground hover:text-green-500 hover:fill-green-500 transition-colors duration-300 cursor-pointer" />
                </div>
                <p className="text-sm text-muted-foreground mb-6">{song.artist}</p>

               
                <Button
                  variant="secondary"
                  size="sm"
                  className={`w-full group-hover:bg-gradient-to-r from-green-500 to-emerald-600 group-hover:text-white transition-all duration-300 ${hoveredId === song.id ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' : ''
                    }`}
                >
                  <Play className={`h-4 w-4 mr-2 transition-transform duration-300 ${hoveredId === song.id ? 'scale-110' : ''
                    }`} />
                  View Lyrics
                </Button>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}