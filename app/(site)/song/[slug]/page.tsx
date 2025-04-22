import type { Metadata } from "next";
import { db } from "@/lib/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { Song } from "@/types";
import SongClient from "./SongClient";
import { generateSongMetadata } from "@/lib/metadata"

interface SongPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: SongPageProps): Promise<Metadata> {
  return generateSongMetadata(params.slug)
}

export default function SongPage({ params }: SongPageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <SongClient slug={params.slug} />
    </div>
  )
}
