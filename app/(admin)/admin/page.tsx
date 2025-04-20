"use client";

import React, { useState, useEffect, useCallback } from "react";
import { SubmissionsTable } from "@/components/admin/submissions-table";
import { Skeleton } from "@/components/ui/skeleton";
import { db } from "@/lib/firebase/config";
import { collection, query, orderBy, getDocs, Timestamp } from "firebase/firestore";
import type { Submission } from "@/types";
import { useSession } from "next-auth/react";

const convertTimestamp = (timestamp: any): Date | any => {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate();
  }
  return timestamp;
};

export default function SubmissionsPage() {
  const { data: session } = useSession();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "submissions"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const fetchedSubmissions = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: convertTimestamp(data.createdAt),
          updatedAt: convertTimestamp(data.updatedAt),
          contributedByEmail: session?.user?.email || "",
          contributedByName: session?.user?.name || "Admin",
          contributedByImage: session?.user?.image || "",
        } as Submission;
      });
      setSubmissions(fetchedSubmissions);
    } catch (error) {
      console.error("Error fetching submissions:", error);
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Manage Submissions</h2>
        {session?.user && (
          <div className="flex items-center gap-2">
            <img
              src={session.user.image || "/placeholder.svg"}
              alt={session.user.name || "Admin"}
              className="h-8 w-8 rounded-full"
            />
            <div>
              <p className="text-sm font-medium">{session.user.name}</p>
              <p className="text-xs text-muted-foreground">{session.user.email}</p>
            </div>
          </div>
        )}
      </div>
      {loading ? (
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : (
        <SubmissionsTable 
          submissions={submissions} 
          onActionComplete={fetchSubmissions}
          contributor={{
            email: session?.user?.email || "",
            name: session?.user?.name || "Admin",
            image: session?.user?.image || "",
          }}
        />
      )}
    </div>
  );
}