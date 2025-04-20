"use client"

import { useState, useRef } from "react"
import { PlusCircle, Search, Edit, Trash2, Music } from "lucide-react"
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
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { db, storage } from "@/lib/firebase/config"
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy, serverTimestamp } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { toast } from "sonner"

interface Song {
  id: string
  title: string
  artist: string
  lyrics: string
  genre: string
  duration: number
  releaseDate: Date | null
  imageUrl: string
  audioUrl: string
  createdAt: Date | null
  updatedAt: Date | null
}

interface SongsTableProps {
  songs: Song[]
  loading: boolean
}

const TableSkeleton = () => (
  <TableRow>
    <TableCell>
      <div className="flex items-center space-x-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-4 w-[120px]" />
      </div>
    </TableCell>
    <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
    <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
    <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
    <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
    <TableCell className="text-right">
      <div className="flex justify-end space-x-1">
        <Skeleton className="h-8 w-8 rounded-md" />
        <Skeleton className="h-8 w-8 rounded-md" />
      </div>
    </TableCell>
  </TableRow>
)

export function SongsTable({ songs, loading }: SongsTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedSong, setSelectedSong] = useState<Song | null>(null)
  const [newSong, setNewSong] = useState({
    title: "",
    artist: "",
    lyrics: "",
    genre: "",
    duration: 0,
    releaseDate: new Date(),
    imageUrl: "/placeholder.svg?height=40&width=40",
    audioUrl: "",
  })
  const [uploadingFile, setUploadingFile] = useState(false)
  const addImageRef = useRef<HTMLInputElement>(null)
  const addAudioRef = useRef<HTMLInputElement>(null)
  const editImageRef = useRef<HTMLInputElement>(null)
  const editAudioRef = useRef<HTMLInputElement>(null)

  const filteredSongs = songs.filter(
    (song) =>
      song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const uploadFile = async (file: File, path: string): Promise<string> => {
    try {
      setUploadingFile(true)
      const storageRef = ref(storage, path)
      await uploadBytes(storageRef, file)
      const downloadURL = await getDownloadURL(storageRef)
      return downloadURL
    } catch (error) {
      console.error("Error uploading file:", error)
      toast.error("Failed to upload file")
      throw error
    } finally {
      setUploadingFile(false)
    }
  }

  const handleAddSong = async () => {
    try {
      if (!newSong.title || !newSong.artist) {
        toast.error("Title and artist are required")
        return
      }
      
      const songData = {
        title: newSong.title,
        artist: newSong.artist,
        lyrics: newSong.lyrics,
        genre: newSong.genre,
        duration: newSong.duration,
        releaseDate: newSong.releaseDate,
        imageUrl: newSong.imageUrl,
        audioUrl: newSong.audioUrl,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }
      
      const docRef = await addDoc(collection(db, "songs"), songData)
      
      let imageUrl = newSong.imageUrl
      let audioUrl = newSong.audioUrl
      
      if (addImageRef.current?.files && addImageRef.current.files[0]) {
        try {
          imageUrl = await uploadFile(addImageRef.current.files[0], `songs/${docRef.id}/cover`)
          await updateDoc(doc(db, "songs", docRef.id), { imageUrl })
        } catch (error) {
          console.error("Error uploading image:", error)
        }
      }
      
      if (addAudioRef.current?.files && addAudioRef.current.files[0]) {
        try {
          audioUrl = await uploadFile(addAudioRef.current.files[0], `songs/${docRef.id}/audio`)
          await updateDoc(doc(db, "songs", docRef.id), { audioUrl })
        } catch (error) {
          console.error("Error uploading audio:", error)
        }
      }
      
      setNewSong({
        title: "",
        artist: "",
        lyrics: "",
        genre: "",
        duration: 0,
        releaseDate: new Date(),
        imageUrl: "/placeholder.svg?height=40&width=40",
        audioUrl: "",
      })
      
      if (addImageRef.current) addImageRef.current.value = ""
      if (addAudioRef.current) addAudioRef.current.value = ""
      
      setIsAddDialogOpen(false)
      toast.success("Song added successfully")
    } catch (error) {
      console.error("Error adding song:", error)
      toast.error("Failed to add song")
    }
  }

  const handleEditSong = async () => {
    if (!selectedSong) return
    
    try {
      if (!selectedSong.title || !selectedSong.artist) {
        toast.error("Title and artist are required")
        return
      }
      
      let imageUrl = selectedSong.imageUrl
      let audioUrl = selectedSong.audioUrl
      
      if (editImageRef.current?.files && editImageRef.current.files[0]) {
        try {
          imageUrl = await uploadFile(editImageRef.current.files[0], `songs/${selectedSong.id}/cover`)
        } catch (error) {
          console.error("Error uploading image:", error)
        }
      }
      
      if (editAudioRef.current?.files && editAudioRef.current.files[0]) {
        try {
          audioUrl = await uploadFile(editAudioRef.current.files[0], `songs/${selectedSong.id}/audio`)
        } catch (error) {
          console.error("Error uploading audio:", error)
        }
      }
      
      const songRef = doc(db, "songs", selectedSong.id)
      await updateDoc(songRef, {
        title: selectedSong.title,
        artist: selectedSong.artist,
        lyrics: selectedSong.lyrics,
        genre: selectedSong.genre,
        duration: selectedSong.duration,
        releaseDate: selectedSong.releaseDate,
        imageUrl,
        audioUrl,
        updatedAt: serverTimestamp()
      })
      
      if (editImageRef.current) editImageRef.current.value = ""
      if (editAudioRef.current) editAudioRef.current.value = ""
      
      setIsEditDialogOpen(false)
      toast.success("Song updated successfully")
    } catch (error) {
      console.error("Error updating song:", error)
      toast.error("Failed to update song")
    }
  }

  const handleDeleteSong = async (id: string) => {
    try {
      await deleteDoc(doc(db, "songs", id))
      setIsDeleteDialogOpen(false)
      toast.success("Song deleted successfully")
    } catch (error) {
      console.error("Error deleting song:", error)
      toast.error("Failed to delete song")
    }
  }

  const openEditDialog = (song: Song) => {
    setSelectedSong(song)
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (song: Song) => {
    setSelectedSong(song)
    setIsDeleteDialogOpen(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <h1 className="text-2xl font-bold tracking-tight">Songs Management</h1>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search songs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-[250px] pl-8"
            />
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Song
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Song</DialogTitle>
                <DialogDescription>Enter the details for the new song.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Song Title</Label>
                  <Input
                    id="title"
                    value={newSong.title}
                    onChange={(e) => setNewSong({ ...newSong, title: e.target.value })}
                    placeholder="Enter song title"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="artist">Artist</Label>
                  <Input
                    id="artist"
                    value={newSong.artist}
                    onChange={(e) => setNewSong({ ...newSong, artist: e.target.value })}
                    placeholder="Enter artist name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lyrics">Lyrics</Label>
                  <Textarea
                    id="lyrics"
                    value={newSong.lyrics}
                    onChange={(e) => setNewSong({ ...newSong, lyrics: e.target.value })}
                    placeholder="Enter song lyrics"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="genre">Genre</Label>
                  <Input
                    id="genre"
                    value={newSong.genre}
                    onChange={(e) => setNewSong({ ...newSong, genre: e.target.value })}
                    placeholder="Enter genre"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="duration">Duration (seconds)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={newSong.duration}
                    onChange={(e) => setNewSong({ ...newSong, duration: parseInt(e.target.value) })}
                    placeholder="Enter duration in seconds"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="releaseDate">Release Date</Label>
                  <Input
                    id="releaseDate"
                    type="date"
                    value={newSong.releaseDate?.toISOString().split('T')[0]}
                    onChange={(e) => setNewSong({ ...newSong, releaseDate: new Date(e.target.value) })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="image">Cover Image</Label>
                  <Input 
                    id="image" 
                    type="file" 
                    accept="image/*" 
                    ref={addImageRef}
                  />
                  <p className="text-xs text-muted-foreground">Upload a cover image for the song (optional).</p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="audio">Audio File</Label>
                  <Input 
                    id="audio" 
                    type="file" 
                    accept="audio/*" 
                    ref={addAudioRef}
                  />
                  <p className="text-xs text-muted-foreground">Upload the audio file for the song (required).</p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddSong} disabled={uploadingFile}>
                  {uploadingFile ? "Adding..." : "Add Song"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Song</TableHead>
              <TableHead>Artist</TableHead>
              <TableHead>Genre</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Release Date</TableHead>
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
            ) : filteredSongs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No songs found.
                </TableCell>
              </TableRow>
            ) : (
              filteredSongs.map((song) => (
                <TableRow key={song.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={song.imageUrl} alt={song.title} />
                        <AvatarFallback><Music className="h-4 w-4" /></AvatarFallback>
                      </Avatar>
                      <div className="font-medium">{song.title}</div>
                    </div>
                  </TableCell>
                  <TableCell>{song.artist}</TableCell>
                  <TableCell>{song.genre}</TableCell>
                  <TableCell>{song.duration}s</TableCell>
                  <TableCell>{song.releaseDate?.toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-blue-500"
                        onClick={() => openEditDialog(song)}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500"
                        onClick={() => openDeleteDialog(song)}
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

      {selectedSong && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Song</DialogTitle>
              <DialogDescription>Update the details for {selectedSong.title}.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Song Title</Label>
                <Input
                  id="edit-title"
                  value={selectedSong.title}
                  onChange={(e) =>
                    setSelectedSong({
                      ...selectedSong,
                      title: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-artist">Artist</Label>
                <Input
                  id="edit-artist"
                  value={selectedSong.artist}
                  onChange={(e) =>
                    setSelectedSong({
                      ...selectedSong,
                      artist: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-lyrics">Lyrics</Label>
                <Textarea
                  id="edit-lyrics"
                  value={selectedSong.lyrics}
                  onChange={(e) =>
                    setSelectedSong({
                      ...selectedSong,
                      lyrics: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-genre">Genre</Label>
                <Input
                  id="edit-genre"
                  value={selectedSong.genre}
                  onChange={(e) =>
                    setSelectedSong({
                      ...selectedSong,
                      genre: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-duration">Duration (seconds)</Label>
                <Input
                  id="edit-duration"
                  type="number"
                  value={selectedSong.duration}
                  onChange={(e) =>
                    setSelectedSong({
                      ...selectedSong,
                      duration: parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-releaseDate">Release Date</Label>
                <Input
                  id="edit-releaseDate"
                  type="date"
                  value={selectedSong.releaseDate?.toISOString().split('T')[0]}
                  onChange={(e) =>
                    setSelectedSong({
                      ...selectedSong,
                      releaseDate: new Date(e.target.value),
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-image">Cover Image</Label>
                <Input 
                  id="edit-image" 
                  type="file" 
                  accept="image/*" 
                  ref={editImageRef}
                />
                <div className="flex items-center space-x-3 mt-2">
                  <Avatar>
                    <AvatarImage src={selectedSong.imageUrl} alt={selectedSong.title} />
                    <AvatarFallback><Music className="h-4 w-4" /></AvatarFallback>
                  </Avatar>
                  <p className="text-xs text-muted-foreground">Current cover image</p>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-audio">Audio File</Label>
                <Input 
                  id="edit-audio" 
                  type="file" 
                  accept="audio/*" 
                  ref={editAudioRef}
                />
                <p className="text-xs text-muted-foreground">Current audio file: {selectedSong.audioUrl ? "Uploaded" : "Not uploaded"}</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditSong} disabled={uploadingFile}>
                {uploadingFile ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {selectedSong && (
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete {selectedSong.title} by {selectedSong.artist}? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={() => handleDeleteSong(selectedSong.id)}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

