export interface Submission {
  id: string;
  songTitle: string;
  artistName: string;
  albumName?: string;
  releaseDate?: string;
  genre: string;
  language?: string;
  lyrics: string;
  contributors?: string;
  notes?: string;
  imageUrl?: string | null;
  status: "pending" | "approved" | "rejected";
  submittedBy?: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string;
  releaseDate?: string;
  genre: string;
  language?: string;
  lyrics: string;
  views?: number;
  imageUrl?: string;
  duration?: string;
  contributors: string[];
  createdAt: any;
  updatedAt?: any;
  originalSubmissionId?: string;
}

export interface Artist {
  id: string;
  name: string;
  bio: string;
  imageUrl: string | null;
  genres?: string[];
  songCount?: number;
  albumCount?: number;
  stats?: {
    songs: number;
    albums: number;
  };
  createdAt?: any;
}

export interface AdminUser {
  id: string;
  email: string;
  name?: string;
  image?: string;
  isAdmin: boolean;
  contributions: string[];
  lastLogin?: any;
}
