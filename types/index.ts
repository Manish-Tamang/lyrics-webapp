export interface Submission {
  id: string;
  songTitle: string;
  artistName: string;
  albumName: string;
  releaseDate: string;
  genre: string;
  language: string;
  lyrics: string;
  contributors: string;
  notes: string;
  imageUrl: string | null;
}

export interface Song {
  id: string;
  songTitle: string;
  artistName: string;
  albumName: string;
  releaseDate: string;
  genre: string;
  language: string;
  lyrics: string;
  contributors: string;
  notes: string;
  imageUrl: string | null;
  duration?: string;
}

export interface Artist {
  id: string;
  name: string;
  bio: string;
  image: string | null;
  genres: string[];
}
