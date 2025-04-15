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
  title: string;
  artist: string;
  album: string;
  releaseDate: string;
  genre: string;
  language: string;
  lyrics: string;
  views?: number;
  imageUrl?: string;
  duration?: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface Artist {
  id: string;
  name: string;
  bio: string;
  image: string | null;
  genres: string[];
}
