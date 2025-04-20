import { Timestamp } from "firebase/firestore";

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
  contributors?: string[];
  contributedByEmail: string;
  contributedByName: string;
  contributedByImage?: string;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  originalSubmissionId?: string;
  slug: string;
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
  createdAt?: Timestamp;
}

export interface AdminUser {
  id: string;
  email: string;
  name?: string;
  image?: string;
  isAdmin: boolean;
  contributions: string[];
  lastLogin?: Timestamp;
}

export interface Submission {
  id: string;
  songTitle: string;
  artistName: string;
  albumName?: string;
  releaseDate?: string;
  genre: string;
  language?: string;
  lyrics: string;
  imageUrl?: string | null;
  contributors?: string;
  submittedBy?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  contributedByEmail?: string;
  contributedByName?: string;
  contributedByImage?: string;
}
