"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { Submission } from "@/types"

interface RecentSubmissionsProps {
  submissions: Submission[]
  loading: boolean
}

export function RecentSubmissions({ submissions, loading }: RecentSubmissionsProps) {
  if (loading) {
    return (
      <div className="space-y-8">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center">
            <div className="space-y-1">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {submissions.map((submission) => (
        <div key={submission.id} className="flex items-center">
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">{submission.songTitle}</p>
            <p className="text-sm text-muted-foreground">{submission.artistName}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

