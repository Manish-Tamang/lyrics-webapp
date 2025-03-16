"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase/config";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { Submission } from "@/types";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface Props { }

const SubmissionsTable = (props: Props) => {
  const [data, setData] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "submissions"));
      const submissionsData: Submission[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Submission[];
      setData(submissionsData);
    } catch (error) {
      console.error("Error fetching submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await updateDoc(doc(db, "submissions", id), {
        status: "approved",
      });
      setData((prevData) =>
        prevData.map((submission) =>
          submission.id === id ? { ...submission, status: "approved" } : submission
        )
      );
    } catch (error) {
      console.error("Error approving submission:", error);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await updateDoc(doc(db, "submissions", id), {
        status: "rejected",
      });
      setData((prevData) =>
        prevData.map((submission) =>
          submission.id === id ? { ...submission, status: "rejected" } : submission
        )
      );
    } catch (error) {
      console.error("Error rejecting submission:", error);
    }
  };

  const columns = [
    {
      header: "Song Title",
      cell: (info: any) => info.row.original.songTitle,
    },
    {
      header: "Artist Name",
      cell: (info: any) => info.row.original.artistName,
    },
    {
      header: "Genre",
      cell: (info: any) => info.row.original.genre,
    },
    {
      header: "Status",
      cell: (info: any) => info.row.original.status,
    },
    {
      header: "Actions",
      cell: (info: any) => {
        const submission = info.row.original;
        return (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleApprove(submission.id)}
              disabled={submission.status !== "pending"}
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleReject(submission.id)}
              disabled={submission.status !== "pending"}
            >
              <X className="h-4 w-4" />
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

  if (loading) {
    return <p>Loading submissions...</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="px-4 py-2 text-left">
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
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="border px-4 py-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export { SubmissionsTable };