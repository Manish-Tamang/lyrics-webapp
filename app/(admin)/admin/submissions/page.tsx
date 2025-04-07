"use client"

import { useState, useEffect } from "react"
import { Eye, Check, X, Edit, Trash2, Search, Loader2 } from "lucide-react"
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
import { Skeleton } from "@/components/ui/skeleton"
import { db } from "@/lib/firebase/config"
import { collection, getDocs, doc, updateDoc, deleteDoc, query, orderBy, serverTimestamp, addDoc } from "firebase/firestore"
import { toast } from "sonner"

// Define the Submission type
interface Submission {
  id: string
  songTitle: string
  artistName: string
  albumName: string
  releaseDate: string
  genre: string
  language: string
  lyrics: string
  contributors: string
  notes: string
  imageUrl: string | null
  status: "pending" | "approved" | "rejected"
  createdAt: any
  updatedAt: any
}

// Skeleton component for loading state
const TableSkeleton = () => (
  <TableRow>
    <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
    <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
    <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
    <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
    <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
    <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
    <TableCell className="text-right">
      <div className="flex justify-end space-x-1">
        <Skeleton className="h-8 w-8 rounded-md" />
        <Skeleton className="h-8 w-8 rounded-md" />
        <Skeleton className="h-8 w-8 rounded-md" />
      </div>
    </TableCell>
  </TableRow>
)

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  // Fetch submissions from Firebase
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true)
        const submissionsQuery = query(collection(db, "lyricsSubmissions"), orderBy("createdAt", "desc"))
        const submissionsSnapshot = await getDocs(submissionsQuery)
        
        const submissionsData: Submission[] = []
        submissionsSnapshot.forEach((doc) => {
          const data = doc.data()
          submissionsData.push({
            id: doc.id,
            songTitle: data.songTitle || "",
            artistName: data.artistName || "",
            albumName: data.albumName || "",
            releaseDate: data.releaseDate || "",
            genre: data.genre || "",
            language: data.language || "",
            lyrics: data.lyrics || "",
            contributors: data.contributors || "",
            notes: data.notes || "",
            imageUrl: data.imageUrl || null,
            status: data.status || "pending",
            createdAt: data.createdAt,
            updatedAt: data.updatedAt
          })
        })
        
        setSubmissions(submissionsData)
      } catch (error) {
        console.error("Error fetching submissions:", error)
        toast.error("Failed to load submissions")
      } finally {
        setLoading(false)
      }
    }

    fetchSubmissions()
  }, [])

  const filteredSubmissions = submissions.filter((submission) => {
    const matchesSearch =
      submission.songTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.artistName.toLowerCase().includes(searchTerm.toLowerCase())

    if (activeTab === "all") return matchesSearch
    return matchesSearch && submission.status === activeTab
  })

  const handleApprove = async (id: string) => {
    try {
      setActionLoading(true)
      const submissionRef = doc(db, "lyricsSubmissions", id)
      
      // Get the submission data
      const submission = submissions.find(s => s.id === id)
      if (!submission) {
        throw new Error("Submission not found")
      }
      
      // Update the submission status
      await updateDoc(submissionRef, {
        status: "approved",
        updatedAt: serverTimestamp()
      })
      
      // Add the song to the songs collection
      await addDoc(collection(db, "songs"), {
        title: submission.songTitle,
        artist: submission.artistName,
        album: submission.albumName || "",
        genre: submission.genre,
        language: submission.language,
        releaseDate: submission.releaseDate || "",
        lyrics: submission.lyrics,
        contributors: submission.contributors || "",
        notes: submission.notes || "",
        imageUrl: submission.imageUrl,
        views: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      
      // Update the local state
      setSubmissions(
        submissions.map((submission) => 
          submission.id === id ? { ...submission, status: "approved" } : submission
        )
      )
      
      toast.success("Submission approved and added to songs collection")
    } catch (error) {
      console.error("Error approving submission:", error)
      toast.error("Failed to approve submission")
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async (id: string) => {
    try {
      setActionLoading(true)
      const submissionRef = doc(db, "lyricsSubmissions", id)
      await updateDoc(submissionRef, {
        status: "rejected",
        updatedAt: serverTimestamp()
      })
      
      setSubmissions(
        submissions.map((submission) => 
          submission.id === id ? { ...submission, status: "rejected" } : submission
        )
      )
      
      toast.success("Submission rejected successfully")
    } catch (error) {
      console.error("Error rejecting submission:", error)
      toast.error("Failed to reject submission")
    } finally {
      setActionLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      setActionLoading(true)
      await deleteDoc(doc(db, "lyricsSubmissions", id))
      
      setSubmissions(submissions.filter((submission) => submission.id !== id))
      setIsDeleteDialogOpen(false)
      
      toast.success("Submission deleted successfully")
    } catch (error) {
      console.error("Error deleting submission:", error)
      toast.error("Failed to delete submission")
    } finally {
      setActionLoading(false)
    }
  }

  const openPreview = (submission: Submission) => {
    setSelectedSubmission(submission)
    setIsPreviewOpen(true)
  }

  const confirmDelete = (submission: Submission) => {
    setSelectedSubmission(submission)
    setIsDeleteDialogOpen(true)
  }

  // Format date from Firestore timestamp
  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A"
    
    try {
      const date = timestamp.toDate()
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }).format(date)
    } catch (error) {
      return "N/A"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <h1 className="text-2xl font-bold tracking-tight">Lyrics Submissions</h1>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Input
              placeholder="Search submissions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-[250px] pl-9"
            />
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          </div>
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
            {loading ? (
              <>
                <TableSkeleton />
                <TableSkeleton />
                <TableSkeleton />
                <TableSkeleton />
                <TableSkeleton />
              </>
            ) : filteredSubmissions.length === 0 ? (
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
                  <TableCell>{submission.albumName || "N/A"}</TableCell>
                  <TableCell>{submission.genre}</TableCell>
                  <TableCell>{formatDate(submission.createdAt)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        submission.status === "approved"
                          ? "default"
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
                            disabled={actionLoading}
                            title="Approve and add to public songs"
                          >
                            <Check className="h-4 w-4" />
                            <span className="sr-only">Approve and add to public songs</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500"
                            onClick={() => handleReject(submission.id)}
                            disabled={actionLoading}
                            title="Reject submission"
                          >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Reject submission</span>
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
                        disabled={actionLoading}
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
                Album: {selectedSubmission.albumName || "N/A"} • Genre: {selectedSubmission.genre} • Language:{" "}
                {selectedSubmission.language}
              </DialogDescription>
            </DialogHeader>
            {selectedSubmission.imageUrl && (
              <div className="flex justify-center mb-4">
                <img 
                  src={selectedSubmission.imageUrl} 
                  alt={`${selectedSubmission.songTitle} cover`} 
                  className="h-48 w-48 rounded-md object-cover"
                />
              </div>
            )}
            <div className="max-h-[60vh] overflow-y-auto whitespace-pre-line border p-4 rounded-md">
              {selectedSubmission.lyrics || "No lyrics available"}
            </div>
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
                      disabled={actionLoading}
                    >
                      {actionLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Approving...
                        </>
                      ) : (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          Approve & Add to Songs
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      className="text-red-500"
                      onClick={() => {
                        handleReject(selectedSubmission.id)
                        setIsPreviewOpen(false)
                      }}
                      disabled={actionLoading}
                    >
                      {actionLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Rejecting...
                        </>
                      ) : (
                        <>
                          <X className="mr-2 h-4 w-4" />
                          Reject
                        </>
                      )}
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
              <Button 
                variant="destructive" 
                onClick={() => handleDelete(selectedSubmission.id)}
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

