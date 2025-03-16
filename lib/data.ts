import { db } from "@/lib/firebase/config";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Song } from "@/types";

export const getRecentSongs = async (limit: number): Promise<Song[]> => {
  const approvedSongsQuery = query(
    collection(db, "lyrics"),
    where("status", "==", "approved")
  );

  try {
    const querySnapshot = await getDocs(approvedSongsQuery);
    const songs: Song[] = querySnapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() } as Song))
      .slice(0, limit);
    return songs;
  } catch (error) {
    console.error("Error fetching recent songs:", error);
    return [];
  }
};

export const getPopularSongs = async (limit: number): Promise<Song[]> => {
  const approvedSongsQuery = query(
    collection(db, "lyrics"),
    where("status", "==", "approved")
  );

  try {
    const querySnapshot = await getDocs(approvedSongsQuery);
    const songs: Song[] = querySnapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() } as Song))
      .slice(0, limit);
    return songs;
  } catch (error) {
    console.error("Error fetching popular songs:", error);
    return [];
  }
};

export const getApprovedSongs = async (): Promise<Song[]> => {
  const approvedSongsQuery = query(
    collection(db, "lyrics"),
    where("status", "==", "approved")
  );

  try {
    const querySnapshot = await getDocs(approvedSongsQuery);
    const songs: Song[] = querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Song)
    );
    return songs;
  } catch (error) {
    console.error("Error fetching approved songs:", error);
    return [];
  }
};
