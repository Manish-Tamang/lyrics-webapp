"use client"

import { useState } from "react"
import { Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const recentSubmissions = [
  {
    id: "1",
    songTitle: "Midnight Dreams",
    artistName: "Luna Eclipse",
    submittedAt: "2 hours ago",
    status: "pending",
  },
  {
    id: "2",
    songTitle: "Ocean Waves",
    artistName: "Coastal Sounds",
    submittedAt: "5 hours ago",
    status: "pending",
  },
  {
    id: "3",
    songTitle: "Mountain High",
    artistName: "Alpine Echoes",
    submittedAt: "1 day ago",
    status: "pending",
  },
  {
    id: "4",
    songTitle: "City Lights",
    artistName: "Urban Vibes",
    submittedAt: "1 day ago",
    status: "pending",
  },
  {
    id: "5",
    songTitle: "Desert Wind",
    artistName: "Sandy Tunes",
    submittedAt: "2 days ago",
    status: "pending",
  },
]

export function RecentSubmissions() {
  const [submissions, setSubmissions] = useState(recentSubmissions)

  const handleApprove = (id: string) => {
    setSubmissions(
      submissions.map((submission) => (submission.id === id ? { ...submission, status: "approved" } : submission)),
    )
  }

  const handleReject = (id: string) => {
    setSubmissions(
      submissions.map((submission) => (submission.id === id ? { ...submission, status: "rejected" } : submission)),
    )
  }

  return (
    <div className="space-y-8">
      {submissions.map((submission) => (
        <div key={submission.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={`/placeholder.svg?height=36&width=36`} alt={submission.artistName} />
            <AvatarFallback>{submission.artistName.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{submission.songTitle}</p>
            <p className="text-sm text-muted-foreground">{submission.artistName}</p>
          </div>
          <div className="ml-auto text-sm text-muted-foreground">{submission.submittedAt}</div>
          {submission.status === "pending" ? (
            <div className="ml-2 flex space-x-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 text-green-500"
                onClick={() => handleApprove(submission.id)}
              >
                <Check className="h-4 w-4" />
                <span className="sr-only">Approve</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 text-red-500"
                onClick={() => handleReject(submission.id)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Reject</span>
              </Button>
            </div>
          ) : submission.status === "approved" ? (
            <div className="ml-2 text-sm font-medium text-green-500">Approved</div>
          ) : (
            <div className="ml-2 text-sm font-medium text-red-500">Rejected</div>
          )}
        </div>
      ))}
    </div>
  )
}

