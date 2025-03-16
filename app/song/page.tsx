import type { Metadata } from "next";
import SongListClient from "./SongListClient";

export const metadata: Metadata = {
  title: "All Songs | LyricVerse",
  description: "Browse all songs and lyrics in our collection",
};

export default async function SongsPage() {
  return <SongListClient />;
}