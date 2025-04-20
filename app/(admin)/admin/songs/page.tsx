"use client"

import { useState, useEffect, useRef } from "react"
import { PlusCircle, Search, Edit, Trash2, Eye, Image as ImageIcon } from "lucide-react"
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
import { Skeleton } from "@/components/ui/skeleton"
import { db, storage } from "@/lib/firebase/config"
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  arrayUnion
} from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { toast } from "sonner"
import { useSession } from "next-auth/react"

// Song type definition
interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  genre: string;
  language: string;
  releaseDate: string;
  views: number;
  lyrics?: string;
  imageUrl?: string;
  createdAt?: any;
  updatedAt?: any;
}

// Artist type definition
interface Artist {
  id: string;
  name: string;
  bio: string;
  songCount: number;
  albumCount: number;
  imageUrl: string;
}

// Genre options
const genreOptions = [
  "Pop", "Love", "Rock", "Hip Hop", "Electronic", "Indie", "Folk",
  "R&B", "Jazz", "Classical", "Country", "World", "Ambient"
];

// Language options
const languageOptions = [
  "English", "Nepali", "Spanish", "French", "German", "Italian",
  "Portuguese", "Japanese", "Korean", "Chinese", "Instrumental"
];

const TableSkeleton = () => (
  <TableRow>
    <TableCell><Skeleton className="h-10 w-10 rounded-md" /></TableCell>
    <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
    <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
    <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
    <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
    <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
    <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
    <TableCell><Skeleton className="h-4 w-[50px]" /></TableCell>
    <TableCell className="text-right">
      <div className="flex justify-end space-x-1">
        <Skeleton className="h-8 w-8 rounded-md" />
        <Skeleton className="h-8 w-8 rounded-md" />
        <Skeleton className="h-8 w-8 rounded-md" />
      </div>
    </TableCell>
  </TableRow>
);


export default function SongsPage() {
  const { data: session } = useSession();
  const [songs, setSongs] = useState<Song[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [selectedSong, setSelectedSong] = useState<Song | null>(null)
  const [newSong, setNewSong] = useState({
    title: "",
    artist: "",
    album: "",
    genre: "",
    language: "",
    releaseDate: "",
    lyrics: "",
    imageUrl: "",
  })
  const [loading, setLoading] = useState(true)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [artists, setArtists] = useState<Artist[]>([])
  const [albums, setAlbums] = useState<string[]>([])
  const addImageRef = useRef<HTMLInputElement>(null)
  const editImageRef = useRef<HTMLInputElement>(null)

  // Fetch songs from Firebase
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch songs
        const songsQuery = query(collection(db, "songs"), orderBy("createdAt", "desc"))
        const songsSnapshot = await getDocs(songsQuery)

        const songsData: Song[] = []
        const albumsSet = new Set<string>()

        songsSnapshot.forEach((doc) => {
          const songData = { id: doc.id, ...doc.data() } as Song
          songsData.push(songData)

          if (songData.album) albumsSet.add(songData.album)
        })

        setSongs(songsData)
        setAlbums(Array.from(albumsSet))

        // Fetch artists
        const artistsQuery = query(collection(db, "artists"), orderBy("name"))
        const artistsSnapshot = await getDocs(artistsQuery)

        const artistsData: Artist[] = []
        artistsSnapshot.forEach((doc) => {
          const artistData = { id: doc.id, ...doc.data() } as Artist
          artistsData.push(artistData)
        })

        setArtists(artistsData)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast.error("Failed to load data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredSongs = songs.filter(
    (song) =>
      song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const uploadImage = async (file: File, songId: string): Promise<string> => {
    try {
      setUploadingImage(true)
      const storageRef = ref(storage, `songs/${songId}/${file.name}`)
      await uploadBytes(storageRef, file)
      const downloadURL = await getDownloadURL(storageRef)
      return downloadURL
    } catch (error) {
      console.error("Error uploading image:", error)
      toast.error("Failed to upload image")
      throw error
    } finally {
      setUploadingImage(false)
    }
  }

  const handleAddSong = async () => {
    try {
      setLoading(true)

      if (!session?.user?.email) {
        toast.error("User session not found")
        return
      }

      // Validate required fields
      if (!newSong.title || !newSong.artist) {
        toast.error("Title and artist are required")
        return
      }

      const songData = {
        title: newSong.title,
        artist: newSong.artist,
        album: newSong.album,
        genre: newSong.genre,
        language: newSong.language,
        releaseDate: newSong.releaseDate,
        lyrics: newSong.lyrics,
        views: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        // Add contributor information
        contributedByEmail: session.user.email,
        contributedByName: session.user.name || "Admin",
        contributedByImage: session.user.image || "",
        contributors: [session.user.email]
      }

      const docRef = await addDoc(collection(db, "songs"), songData)

      let imageUrl = newSong.imageUrl

      if (addImageRef.current?.files && addImageRef.current.files[0]) {
        try {
          imageUrl = await uploadImage(addImageRef.current.files[0], docRef.id)
          await updateDoc(doc(db, "songs", docRef.id), { imageUrl })
        } catch (error) {
          console.error("Error uploading image:", error)
        }
      }

      // Update admin user's contributions
      const adminUserRef = doc(db, "users", session.user.email)
      await updateDoc(adminUserRef, {
        contributions: arrayUnion(docRef.id),
        lastContribution: serverTimestamp(),
        name: session.user.name,
        image: session.user.image
      })

      // Add the new song to the state with the generated ID
      const newSongWithId = {
        ...songData,
        id: docRef.id,
        views: 0,
        imageUrl
      } as Song

      setSongs([newSongWithId, ...songs])

      // Update albums list if needed
      if (newSong.album && !albums.includes(newSong.album)) {
        setAlbums([...albums, newSong.album])
      }

      // Reset form
      setNewSong({
        title: "",
        artist: "",
        album: "",
        genre: "",
        language: "",
        releaseDate: "",
        lyrics: "",
        imageUrl: "",
      })

      if (addImageRef.current) {
        addImageRef.current.value = ""
      }

      setIsAddDialogOpen(false)
      toast.success("Song added successfully")
    } catch (error) {
      console.error("Error adding song:", error)
      toast.error("Failed to add song")
    } finally {
      setLoading(false)
    }
  }

  const handleEditSong = async () => {
    if (!selectedSong || !session?.user?.email) return

    try {
      setLoading(true)

      // Validate required fields
      if (!selectedSong.title || !selectedSong.artist) {
        toast.error("Title and artist are required")
        return
      }

      let imageUrl = selectedSong.imageUrl

      if (editImageRef.current?.files && editImageRef.current.files[0]) {
        try {
          imageUrl = await uploadImage(editImageRef.current.files[0], selectedSong.id)
        } catch (error) {
          console.error("Error uploading image:", error)
        }
      }

      const songRef = doc(db, "songs", selectedSong.id)

      const songData = {
        title: selectedSong.title,
        artist: selectedSong.artist,
        album: selectedSong.album,
        genre: selectedSong.genre,
        language: selectedSong.language,
        releaseDate: selectedSong.releaseDate,
        imageUrl,
        updatedAt: serverTimestamp(),
        // Update contributor information
        contributedByEmail: session.user.email,
        contributedByName: session.user.name || "Admin",
        contributedByImage: session.user.image || "",
        contributors: arrayUnion(session.user.email)
      }

      await updateDoc(songRef, songData)

      // Update admin user's contributions if not already included
      const adminUserRef = doc(db, "users", session.user.email)
      await updateDoc(adminUserRef, {
        contributions: arrayUnion(selectedSong.id),
        lastContribution: serverTimestamp(),
        name: session.user.name,
        image: session.user.image
      })

      // Update the songs state
      setSongs(
        songs.map((song) =>
          song.id === selectedSong.id
            ? {
              ...song,
              title: selectedSong.title,
              artist: selectedSong.artist,
              album: selectedSong.album,
              genre: selectedSong.genre,
              language: selectedSong.language,
              releaseDate: selectedSong.releaseDate,
              imageUrl,
              contributedByEmail: session.user.email,
              contributedByName: session.user.name || "Admin",
              contributedByImage: session.user.image || "",
            }
            : song,
        ),
      )

      // Update albums list if needed
      if (selectedSong.album && !albums.includes(selectedSong.album)) {
        setAlbums([...albums, selectedSong.album])
      }

      if (editImageRef.current) {
        editImageRef.current.value = ""
      }

      setIsEditDialogOpen(false)
      toast.success("Song updated successfully")
    } catch (error) {
      console.error("Error updating song:", error)
      toast.error("Failed to update song")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteSong = async (id: string) => {
    try {
      setLoading(true)

      await deleteDoc(doc(db, "songs", id))

      setSongs(songs.filter((song) => song.id !== id))
      setIsDeleteDialogOpen(false)
      toast.success("Song deleted successfully")
    } catch (error) {
      console.error("Error deleting song:", error)
      toast.error("Failed to delete song")
    } finally {
      setLoading(false)
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

  const openPreviewDialog = (song: Song) => {
    setSelectedSong(song)
    setIsPreviewOpen(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <h1 className="text-2xl font-bold tracking-tight">Songs Management</h1>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Input
              placeholder="Search songs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-[250px] pl-9"
            />
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Song
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Add New Song</DialogTitle>
                <DialogDescription>Enter the details for the new song.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
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
                    <Select value={newSong.artist} onValueChange={(value) => setNewSong({ ...newSong, artist: value })}>
                      <SelectTrigger id="artist">
                        <SelectValue placeholder="Select artist" />
                      </SelectTrigger>
                      <SelectContent>
                        {artists.map((artist) => (
                          <SelectItem key={artist.id} value={artist.name}>
                            {artist.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="album">Album</Label>
                    <Select value={newSong.album} onValueChange={(value) => setNewSong({ ...newSong, album: value })}>
                      <SelectTrigger id="album">
                        <SelectValue placeholder="Select album" />
                      </SelectTrigger>
                      <SelectContent>
                        {albums.map((album) => (
                          <SelectItem key={album} value={album}>
                            {album}
                          </SelectItem>
                        ))}
                        <SelectItem value="new">+ Add New Album</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="release-date">Release Date</Label>
                    <Input
                      id="release-date"
                      type="date"
                      value={newSong.releaseDate}
                      onChange={(e) => setNewSong({ ...newSong, releaseDate: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="genre">Genre</Label>
                    <Select value={newSong.genre} onValueChange={(value) => setNewSong({ ...newSong, genre: value })}>
                      <SelectTrigger id="genre">
                        <SelectValue placeholder="Select genre" />
                      </SelectTrigger>
                      <SelectContent>
                        {genreOptions.map((genre) => (
                          <SelectItem key={genre} value={genre}>
                            {genre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="language">Language</Label>
                    <Select
                      value={newSong.language}
                      onValueChange={(value) => setNewSong({ ...newSong, language: value })}
                    >
                      <SelectTrigger id="language">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        {languageOptions.map((language) => (
                          <SelectItem key={language} value={language}>
                            {language}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lyrics">Lyrics</Label>
                  <Textarea
                    id="lyrics"
                    value={newSong.lyrics}
                    onChange={(e) => setNewSong({ ...newSong, lyrics: e.target.value })}
                    placeholder="Enter song lyrics"
                    className="min-h-[300px]"
                  />
                  <p className="text-xs text-muted-foreground">
                    Please format the lyrics with line breaks for verses and choruses. Mark chorus sections with
                    "Chorus:" if possible.
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="image">Song Cover Image</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      ref={addImageRef}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => addImageRef.current?.click()}
                      disabled={uploadingImage}
                    >
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Upload a cover image for the song (recommended for singles).
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddSong} disabled={loading || uploadingImage}>
                  {loading || uploadingImage ? "Adding..." : "Add Song"}
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
              <TableHead>Cover</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Artist</TableHead>
              <TableHead>Album</TableHead>
              <TableHead>Genre</TableHead>
              <TableHead>Language</TableHead>
              <TableHead>Release Date</TableHead>
              <TableHead>Views</TableHead>
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
                <TableCell colSpan={9} className="h-24 text-center">
                  No songs found.
                </TableCell>
              </TableRow>
            ) : (
              filteredSongs.map((song) => (
                <TableRow key={song.id}>
                  <TableCell>
                    {song.imageUrl ? (
                      <img
                        src={song.imageUrl}
                        alt={`${song.title} cover`}
                        className="h-10 w-10 rounded-md object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                        <ImageIcon className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{song.title}</TableCell>
                  <TableCell>{song.artist}</TableCell>
                  <TableCell>{song.album}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{song.genre}</Badge>
                  </TableCell>
                  <TableCell>{song.language}</TableCell>
                  <TableCell>{song.releaseDate}</TableCell>
                  <TableCell>{song.views.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      <Button variant="ghost" size="icon" onClick={() => openPreviewDialog(song)}>
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Button>
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

      {/* Preview Dialog */}
      {selectedSong && (
        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>
                {selectedSong.title} by {selectedSong.artist}
              </DialogTitle>
              <DialogDescription>
                Album: {selectedSong.album} • Genre: {selectedSong.genre} • Language: {selectedSong.language}
              </DialogDescription>
            </DialogHeader>
            {selectedSong.imageUrl && (
              <div className="flex justify-center mb-4">
                <img
                  src={selectedSong.imageUrl}
                  alt={`${selectedSong.title} cover`}
                  className="h-48 w-48 rounded-md object-cover"
                />
              </div>
            )}
            <div className="max-h-[60vh] overflow-y-auto whitespace-pre-line border p-4 rounded-md">
              {selectedSong.lyrics || "No lyrics available"}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Dialog */}
      {selectedSong && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Edit Song</DialogTitle>
              <DialogDescription>Update the details for {selectedSong.title}.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
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
                  <Select
                    value={selectedSong.artist}
                    onValueChange={(value) => setSelectedSong({ ...selectedSong, artist: value })}
                  >
                    <SelectTrigger id="edit-artist">
                      <SelectValue placeholder="Select artist" />
                    </SelectTrigger>
                    <SelectContent>
                      {artists.map((artist) => (
                        <SelectItem key={artist.id} value={artist.name}>
                          {artist.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-album">Album</Label>
                  <Select
                    value={selectedSong.album}
                    onValueChange={(value) => setSelectedSong({ ...selectedSong, album: value })}
                  >
                    <SelectTrigger id="edit-album">
                      <SelectValue placeholder="Select album" />
                    </SelectTrigger>
                    <SelectContent>
                      {albums.map((album) => (
                        <SelectItem key={album} value={album}>
                          {album}
                        </SelectItem>
                      ))}
                      <SelectItem value="new">+ Add New Album</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-release-date">Release Date</Label>
                  <Input
                    id="edit-release-date"
                    type="date"
                    value={selectedSong.releaseDate}
                    onChange={(e) =>
                      setSelectedSong({
                        ...selectedSong,
                        releaseDate: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-genre">Genre</Label>
                  <Select
                    value={selectedSong.genre}
                    onValueChange={(value) => setSelectedSong({ ...selectedSong, genre: value })}
                  >
                    <SelectTrigger id="edit-genre">
                      <SelectValue placeholder="Select genre" />
                    </SelectTrigger>
                    <SelectContent>
                      {genreOptions.map((genre) => (
                        <SelectItem key={genre} value={genre}>
                          {genre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-language">Language</Label>
                  <Select
                    value={selectedSong.language}
                    onValueChange={(value) => setSelectedSong({ ...selectedSong, language: value })}
                  >
                    <SelectTrigger id="edit-language">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languageOptions.map((language) => (
                        <SelectItem key={language} value={language}>
                          {language}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-lyrics">Lyrics</Label>
                <Textarea
                  id="edit-lyrics"
                  placeholder="Enter song lyrics"
                  className="min-h-[300px]"
                  value={selectedSong.lyrics || ""}
                  onChange={(e) => setSelectedSong({ ...selectedSong, lyrics: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-image">Song Cover Image</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="edit-image"
                    type="file"
                    accept="image/*"
                    ref={editImageRef}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => editImageRef.current?.click()}
                    disabled={uploadingImage}
                  >
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                </div>
                {selectedSong.imageUrl && (
                  <div className="flex items-center gap-2 mt-2">
                    <img
                      src={selectedSong.imageUrl}
                      alt={`${selectedSong.title} cover`}
                      className="h-10 w-10 rounded-md object-cover"
                    />
                    <p className="text-xs text-muted-foreground">Current cover image</p>
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditSong} disabled={loading || uploadingImage}>
                {loading || uploadingImage ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      {selectedSong && (
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{selectedSong.title}" by {selectedSong.artist}? This action cannot be
                undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={() => handleDeleteSong(selectedSong.id)} disabled={loading}>
                {loading ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

