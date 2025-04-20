"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase/config";
import {
  collection,
  doc,
  updateDoc,
  addDoc,
  serverTimestamp,
  arrayUnion,
  getDoc,
} from "firebase/firestore";
import { Submission, Song, AdminUser } from "@/types";
import { Button } from "@/components/ui/button";
import { Check, X, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

interface Props {
  submissions: Submission[];
  loading: boolean;
}

const SubmissionsTable = ({ submissions, loading: initialLoading }: Props) => {
  const [data, setData] = useState<Submission[]>([]);
  const [isProcessing, setIsProcessing] = useState<Record<string, boolean>>({});
  const { data: session, status: sessionStatus } = useSession();

  useEffect(() => {
    setData(submissions);
  }, [submissions]);

  const handleApprove = async (submissionId: string) => {
    if (sessionStatus !== 'authenticated' || !session?.user?.isAdmin) {
      toast.error("Authentication error or insufficient permissions.");
      return;
    }

    const adminEmail = session.user.email;
    if (!adminEmail) {
      toast.error("Admin email not found in session.");
      return;
    }

    setIsProcessing(prev => ({ ...prev, [submissionId]: true }));

    try {
      const submissionDocRef = doc(db, "submissions", submissionId);
      const submissionSnap = await getDoc(submissionDocRef);

      if (!submissionSnap.exists()) {
        toast.error("Submission not found.");
        throw new Error("Submission not found");
      }

      const submissionData = submissionSnap.data() as Submission;

      const newSongData: Omit<Song, 'id'> = {
        title: submissionData.songTitle,
        artist: submissionData.artistName,
        album: submissionData.albumName || "",
        releaseDate: submissionData.releaseDate || "",
        genre: submissionData.genre,
        language: submissionData.language || "",
        lyrics: submissionData.lyrics,
        imageUrl: submissionData.imageUrl || undefined,
        contributors: [adminEmail],
        views: 0,
        createdAt: serverTimestamp(),
        originalSubmissionId: submissionId,
      };

      const songsCollectionRef = collection(db, "songs");
      const newSongDocRef = await addDoc(songsCollectionRef, newSongData);
      const newSongId = newSongDocRef.id;
      toast.success(`Song "${submissionData.songTitle}" added successfully!`);

      const adminUserDocRef = doc(db, "users", adminEmail);
      await updateDoc(adminUserDocRef, {
        contributions: arrayUnion(newSongId),
      });
      toast.info("Contribution added to your profile.");

      await updateDoc(submissionDocRef, {
        status: "approved",
        updatedAt: serverTimestamp(),
      });

      setData((prevData) =>
        prevData.map((submission) =>
          submission.id === submissionId ? { ...submission, status: "approved" } : submission
        )
      );
    } catch (error) {
      console.error("Error approving submission:", error);
      toast.error("Failed to approve submission. Please check console.");
    } finally {
      setIsProcessing(prev => ({ ...prev, [submissionId]: false }));
    }
  };

  const handleReject = async (submissionId: string) => {
    if (sessionStatus !== 'authenticated' || !session?.user?.isAdmin) {
      toast.error("Authentication error or insufficient permissions.");
      return;
    }
    setIsProcessing(prev => ({ ...prev, [submissionId]: true }));
    try {
      await updateDoc(doc(db, "submissions", submissionId), {
        status: "rejected",
        updatedAt: serverTimestamp(),
      });
      setData((prevData) =>
        prevData.map((submission) =>
          submission.id === submissionId ? { ...submission, status: "rejected" } : submission
        )
      );
      toast.success("Submission rejected.");
    } catch (error) {
      console.error("Error rejecting submission:", error);
      toast.error("Failed to reject submission.");
    } finally {
      setIsProcessing(prev => ({ ...prev, [submissionId]: false }));
    }
  };

  const columns = [
    {
      accessorKey: "songTitle",
      header: "Song Title",
    },
    {
      accessorKey: "artistName",
      header: "Artist Name",
    },
    {
      accessorKey: "genre",
      header: "Genre",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: (info: any) => {
        const status = info.getValue() as string;
        let badgeClass = "bg-gray-200 text-gray-800";
        if (status === 'approved') badgeClass = "bg-green-200 text-green-800";
        if (status === 'rejected') badgeClass = "bg-red-200 text-red-800";
        return <span className={`px-2 py-1 rounded-full text-xs font-medium ${badgeClass}`}>{status}</span>;
      }
    },
    {
      id: "actions",
      header: "Actions",
      cell: (info: any) => {
        const submission = info.row.original as Submission;
        const isRowProcessing = isProcessing[submission.id];
        const isDisabled = submission.status !== "pending" || isRowProcessing || sessionStatus !== 'authenticated';

        return (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleApprove(submission.id)}
              disabled={isDisabled}
              title={submission.status !== 'pending' ? `Already ${submission.status}` : "Approve"}
            >
              {isRowProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4 text-green-600" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleReject(submission.id)}
              disabled={isDisabled}
              title={submission.status !== 'pending' ? `Already ${submission.status}` : "Reject"}
            >
              {isRowProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4 text-red-600" />}
            </Button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (initialLoading || sessionStatus === 'loading') {
    return <div className="flex justify-center items-center p-8"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /> <span className="ml-2">Loading submissions...</span></div>;
  }

  if (sessionStatus === 'unauthenticated') {
    return <p className="text-center text-red-500 p-4">You must be logged in to view submissions.</p>;
  }

  if (!session?.user?.isAdmin) {
    return <p className="text-center text-red-500 p-4">You do not have permission to view this page.</p>;
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <table className="w-full caption-bottom text-sm">
        <thead className="[&_tr]:border-b">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="[&_tr:last-child]:border-0">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id} data-state={row.getIsSelected() && "selected"} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="h-24 text-center">
                No pending submissions found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export { SubmissionsTable };