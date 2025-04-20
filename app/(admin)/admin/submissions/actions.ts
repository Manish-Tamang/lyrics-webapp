"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/firebase/config";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  serverTimestamp,
  arrayUnion,
  writeBatch,
  Timestamp,
} from "firebase/firestore";
import type { Submission, Song } from "@/types";
import { auth } from "@/auth";

export async function approveSubmissionAction(
  submissionId: string
): Promise<{ success: boolean; message: string; songId?: string }> {
  const session = await auth();

  if (!session?.user?.isAdmin || !session.user.email) {
    return { success: false, message: "Unauthorized or invalid session." };
  }

  const adminEmail = session.user.email;
  const adminName = session.user.name || "Admin";
  const adminImage = session.user.image;
  const submissionRef = doc(db, "submissions", submissionId);
  const adminUserRef = doc(db, "users", adminEmail);

  try {
    const submissionSnap = await getDoc(submissionRef);
    const adminUserSnap = await getDoc(adminUserRef);

    if (!submissionSnap.exists()) {
      return { success: false, message: "Submission not found." };
    }

    const submissionData = submissionSnap.data() as Submission;

    if (submissionData.status !== "pending") {
      return { success: false, message: "Submission already processed." };
    }

    // Create new song document
    const newSongRef = doc(collection(db, "songs"));
    const newSongData = {
      id: newSongRef.id,
      title: submissionData.songTitle,
      artist: submissionData.artistName,
      album: submissionData.albumName,
      releaseDate: submissionData.releaseDate,
      genre: submissionData.genre,
      language: submissionData.language,
      lyrics: submissionData.lyrics,
      imageUrl: submissionData.imageUrl ?? undefined,
      views: 0,
      contributors: [adminEmail],
      contributedByEmail: adminEmail,
      contributedByName: adminName,
      contributedByImage: adminImage,
      createdAt: serverTimestamp() as Timestamp,
      updatedAt: serverTimestamp() as Timestamp,
      originalSubmissionId: submissionId,
    };

    const batch = writeBatch(db);

    // Set the new song document
    batch.set(newSongRef, newSongData);

    // Update submission status
    batch.update(submissionRef, {
      status: "approved",
      updatedAt: serverTimestamp(),
    });

    // Update admin user's contributions
    const currentContributions = adminUserSnap.data()?.contributions || [];
    batch.update(adminUserRef, {
      contributions: arrayUnion(newSongRef.id),
      lastContribution: serverTimestamp(),
      name: adminName,
      image: adminImage,
    });

    await batch.commit();

    revalidatePath("/admin/submissions");
    revalidatePath("/admin/songs");
    revalidatePath("/(site)/song");
    revalidatePath("/");

    return {
      success: true,
      message: "Submission approved and song created.",
      songId: newSongRef.id,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred.";
    return {
      success: false,
      message: `Failed to approve submission: ${errorMessage}`,
    };
  }
}

export async function rejectSubmissionAction(
  submissionId: string
): Promise<{ success: boolean; message: string }> {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return { success: false, message: "Unauthorized action." };
  }

  const submissionRef = doc(db, "submissions", submissionId);

  try {
    const submissionSnap = await getDoc(submissionRef);

    if (!submissionSnap.exists()) {
      return { success: false, message: "Submission not found." };
    }
    if (submissionSnap.data().status !== "pending") {
      return { success: false, message: "Submission already processed." };
    }

    await updateDoc(submissionRef, {
      status: "rejected",
      updatedAt: serverTimestamp(),
    });

    revalidatePath("/admin/submissions");

    return { success: true, message: "Submission rejected." };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred.";
    return {
      success: false,
      message: `Failed to reject submission: ${errorMessage}`,
    };
  }
}
