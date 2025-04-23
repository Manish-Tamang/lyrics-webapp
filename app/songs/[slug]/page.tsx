import { db } from "@/lib/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import ViewCounter from "@/components/view-counter";

interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  genre: string;
  language: string;
  releaseDate: string;
  lyrics: string;
  imageUrl?: string;
}

interface Props {
  params: {
    slug: string;
  };
}

export default async function SongPage({ params }: Props) {
  const { slug } = params;

  const docRef = doc(db, "songs", slug);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    notFound();
  }

  const song = { id: docSnap.id, ...docSnap.data() } as Song;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{song.title}</h1>
            <p className="text-lg text-muted-foreground">{song.artist}</p>
          </div>
          <div className="flex items-center gap-2">
            <ViewCounter slug={song.id} />
            <Badge variant="outline">{song.genre}</Badge>
          </div>
        </div>

        {song.imageUrl && (
          <div className="relative aspect-square w-full max-w-md mx-auto">
            <Image
              src={song.imageUrl}
              alt={`${song.title} cover`}
              fill
              className="rounded-lg object-cover"
              priority
            />
          </div>
        )}

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <h2 className="text-2xl font-semibold mb-4">Lyrics</h2>
          <div className="whitespace-pre-line">{song.lyrics}</div>
        </div>
      </div>
    </div>
  );
} 