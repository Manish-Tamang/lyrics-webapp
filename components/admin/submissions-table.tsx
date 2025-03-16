"use client"

import { useState } from "react"
import { Eye, Check, X, Edit, Trash2, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data for submissions
const mockSubmissions = [
  {
    id: "1",
    songTitle: "Midnight Dreams",
    artistName: "Luna Eclipse",
    albumName: "Lunar Phase",
    submittedAt: "2023-03-15",
    status: "pending",
    genre: "Pop",
    language: "English",
  },
  {
    id: "2",
    songTitle: "Ocean Waves",
    artistName: "Coastal Sounds",
    albumName: "Seaside Melodies",
    submittedAt: "2023-03-14",
    status: "pending",
    genre: "Indie",
    language: "English",
  },
  {
    id: "3",
    songTitle: "Mountain High",
    artistName: "Alpine Echoes",
    albumName: "Summit",
    submittedAt: "2023-03-13",
    status: "approved",
    genre: "Folk",
    language: "English",
  },
  {
    id: "4",
    songTitle: "City Lights",
    artistName: "Urban Vibes",
    albumName: "Metropolis",
    submittedAt: "2023-03-12",
    status: "rejected",
    genre: "Electronic",
    language: "English",
  },
  {
    id: "5",
    songTitle: "Desert Wind",
    artistName: "Sandy Tunes",
    albumName: "Oasis",
    submittedAt: "2023-03-11",
    status: "pending",
    genre: "World",
    language: "Spanish",
  },
  {
    id: "6",
    songTitle: "Rainy Day",
    artistName: "Weather Patterns",
    albumName: "Seasons",
    submittedAt: "2023-03-10",
    status: "pending",
    genre: "Jazz",
    language: "English",
  },
  {
    id: "7",
    songTitle: "Starlight",
    artistName: "Cosmic Harmony",
    albumName: "Galaxy",
    submittedAt: "2023-03-09",
    status: "approved",
    genre: "Ambient",
    language: "Instrumental",
  },
  {
    id: "8",
    songTitle: "Forest Whispers",
    artistName: "Woodland Creatures",
    albumName: "Nature's Call",
    submittedAt: "2023-03-08",
    status: "pending",
    genre: "Folk",
    language: "English",
  },
]

// Mock lyrics for preview
const mockLyrics = `Verse 1:
Walking through the midnight streets
Shadows dancing at my feet
City lights blur in the rain
Memories flood back again

Chorus:
In the echo of your voice
I find myself, I have no choice
Midnight dreams that never fade
Promises we never made

Verse 2:
Stars above guide my way
Through the night into the day
Time stands still when I'm with you
In this world we make anew

Chorus:
In the echo of your voice
I find myself, I have no choice
Midnight dreams that never fade
Promises we never made

Bridge:
The moon hangs low, the night is deep
Secrets that we choose to keep
In the darkness we are free
Just the stars, just you and me

Chorus:
In the echo of your voice
I find myself, I have no choice
Midnight dreams that never fade
Promises we never made
Promises we never made`

export function SubmissionsTable() {
  const [submissions, setSubmissions] = useState(mockSubmissions)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const filteredSubmissions = submissions.filter((submission) => {
    const matchesSearch =
      submission.songTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.artistName.toLowerCase().includes(searchTerm.toLowerCase())

    if (activeTab === "all") return matchesSearch
    return matchesSearch && submission.status === activeTab
  })

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

  const handleDelete = (id: string) => {
    setSubmissions(submissions.filter((submission) => submission.id !== id))
    setIsDeleteDialogOpen(false)
  }

  const openPreview = (submission: any) => {
    setSelectedSubmission(submission)
    setIsPreviewOpen(true)
  }

  const confirmDelete = (submission: any) => {
    setSelectedSubmission(submission)
    setIsDeleteDialogOpen(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search submissions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-[250px]"
          />
          <Search className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Song Title</TableHead>
              <TableHead>Artist</TableHead>
              <TableHead>Album</TableHead>
              <TableHead>Genre</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSubmissions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No submissions found.
                </TableCell>
              </TableRow>
            ) : (
              filteredSubmissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell className="font-medium">{submission.songTitle}</TableCell>
                  <TableCell>{submission.artistName}</TableCell>
                  <TableCell>{submission.albumName}</TableCell>
                  <TableCell>{submission.genre}</TableCell>
                  <TableCell>{submission.submittedAt}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        submission.status === "approved"
                          ? "success"
                          : submission.status === "rejected"
                            ? "destructive"
                            : "outline"
                      }
                    >
                      {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      <Button variant="ghost" size="icon" onClick={() => openPreview(submission)}>
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Button>
                      {submission.status === "pending" && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-green-500"
                            onClick={() => handleApprove(submission.id)}
                          >
                            <Check className="h-4 w-4" />
                            <span className="sr-only">Approve</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500"
                            onClick={() => handleReject(submission.id)}
                          >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Reject</span>
                          </Button>
                        </>
                      )}
                      <Button variant="ghost" size="icon" className="text-blue-500">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500"
                        onClick={() => confirmDelete(submission)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Preview Dialog */}
      {selectedSubmission && (
        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>
                {selectedSubmission.songTitle} by {selectedSubmission.artistName}
              </DialogTitle>
              <DialogDescription>
                Album: {selectedSubmission.albumName} • Genre: {selectedSubmission.genre} • Language:{" "}
                {selectedSubmission.language}
              </DialogDescription>
            </DialogHeader>
            <div className="max-h-[60vh] overflow-y-auto whitespace-pre-line border p-4 rounded-md">{mockLyrics}</div>
            <DialogFooter className="flex justify-between sm:justify-between">
              <div className="flex space-x-2">
                {selectedSubmission.status === "pending" && (
                  <>
                    <Button
                      variant="outline"
                      className="text-green-500"
                      onClick={() => {
                        handleApprove(selectedSubmission.id)
                        setIsPreviewOpen(false)
                      }}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      className="text-red-500"
                      onClick={() => {
                        handleReject(selectedSubmission.id)
                        setIsPreviewOpen(false)
                      }}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                  </>
                )}
              </div>
              <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      {selectedSubmission && (
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete the submission for "{selectedSubmission.songTitle}" by{" "}
                {selectedSubmission.artistName}? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={() => handleDelete(selectedSubmission.id)}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

