"use client";

import React, { useState, useTransition } from "react";
import { useSession } from "next-auth/react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Submission } from "@/types";
import { toast } from "sonner";
import {
  approveSubmissionAction,
  rejectSubmissionAction,
} from "@/app/(admin)/admin/submissions/actions";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface SubmissionsTableProps {
  submissions: Submission[];
  onActionComplete: () => Promise<void>;
  contributor?: {
    email: string;
    name: string;
    image: string;
  };
}

export function SubmissionsTable({ submissions, onActionComplete, contributor }: SubmissionsTableProps) {
  const { data: session } = useSession();
  const [isPending, startTransition] = useTransition();
  const [processingId, setProcessingId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleApprove = async (submissionId: string) => {
    if (!contributor?.email) {
      toast({
        title: "Error",
        description: "Contributor information is missing",
        variant: "destructive",
      });
      return;
    }

    setProcessingId(submissionId);
    startTransition(async () => {
      const result = await approveSubmissionAction(submissionId);
      if (result.success) {
        toast({
          title: "Success",
          description: "Submission approved successfully",
        });
        await onActionComplete();
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
      setProcessingId(null);
    });
  };

  const handleReject = (submissionId: string) => {
    if (!session?.user?.isAdmin) {
      toast({
        title: "Error",
        description: "Not authorized. Please log in again.",
        variant: "destructive",
      });
      return;
    }
    setProcessingId(submissionId);
    startTransition(async () => {
      const result = await rejectSubmissionAction(submissionId);
      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        });
        onActionComplete?.();
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
      setProcessingId(null);
    });
  };

  const getStatusBadgeVariant = (status: Submission["status"]) => {
    switch (status) {
      case "approved":
        return "default";
      case "rejected":
        return "destructive";
      case "pending":
      default:
        return "secondary";
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Song Title</TableHead>
          <TableHead>Artist</TableHead>
          <TableHead>Submitted By</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {submissions.map((submission) => (
          <TableRow key={submission.id}>
            <TableCell className="font-medium">{submission.songTitle}</TableCell>
            <TableCell>{submission.artistName}</TableCell>
            <TableCell>{submission.submittedBy || "N/A"}</TableCell>
            <TableCell>
              <Badge variant={getStatusBadgeVariant(submission.status)}>
                {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              {submission.status === "pending" && (
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleApprove(submission.id)}
                    disabled={isPending && processingId === submission.id}
                    className="border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700"
                  >
                    {isPending && processingId === submission.id ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle className="mr-2 h-4 w-4" />
                    )}
                    Approve
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleReject(submission.id)}
                    disabled={isPending && processingId === submission.id}
                    className="border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    {isPending && processingId === submission.id ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <XCircle className="mr-2 h-4 w-4" />
                    )}
                    Reject
                  </Button>
                </div>
              )}
              {submission.status !== "pending" && (
                <span className="text-xs text-muted-foreground italic">Processed</span>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}


