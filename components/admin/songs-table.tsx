"use client"

import { useState } from "react"
import { PlusCircle, Search, Edit, Trash2, Eye } from "lucide-react"
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

// Mock data for songs
const mockSongs = [
  {
    id: "1",
    title: "Midnight Dreams",
    artist: "Luna Eclipse",
    album: "Lunar Phase",
    genre: "Pop",
    language: "English",
    releaseDate: "2023-01-15",
    views: 12453,
  },
  {
    id: "2",
    title: "Ocean Waves",
    artist: "Coastal Sounds",
    album: "Seaside Melodies",
    genre: "Indie",
    language: "English",
    releaseDate: "2023-02-22",
    views: 8765,
  },
  {
    id: "3",
    title: "Mountain High",
    artist: "Alpine Echoes",
    album: "Summit",
    genre: "Folk",
    language: "English",
    releaseDate: "2023-03-10",
    views: 5432,
  },
  {
    id: "4",
    title: "City Lights",
    artist: "Urban Vibes",
    album: "Metropolis",
    genre: "Electronic",
    language: "English",
    releaseDate: "2023-04-05",
    views: 9876,
  },
  {
    id: "5",
    title: "Desert Wind",
    artist: "Sandy Tunes",
    album: "Oasis",
    genre: "World",
    language: "Spanish",
    releaseDate: "2023-05-18",
    views: 3456,
  },
  {
    id: "6",
    title: "Rainy Day",
    artist: "Weather Patterns",
    album: "Seasons",
    genre: "Jazz",
    language: "English",
    releaseDate: "2023-06-30",
    views: 7654,
  },
  {
    id: "7",
    title: "Starlight",
    artist: "Cosmic Harmony",
    album: "Galaxy",
    genre: "Ambient",
    language: "Instrumental",
    releaseDate: "2023-07-12",
    views: 4321,
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

// Mock artists for dropdown
const mockArtistOptions = [
  { value: "Luna Eclipse", label: "Luna Eclipse" },
  { value: "Coastal Sounds", label: "Coastal Sounds" },
  { value: "Alpine Echoes", label: "Alpine Echoes" },
  { value: "Urban Vibes", label: "Urban Vibes" },
  { value: "Sandy Tunes", label: "Sandy Tunes" },
  { value: "Weather Patterns", label: "Weather Patterns" },
  { value: "Cosmic Harmony", label: "Cosmic Harmony" },
]

// Mock albums for dropdown
const mockAlbumOptions = [
  { value: "Lunar Phase", label: "Lunar Phase" },
  { value: "Seaside Melodies", label: "Seaside Melodies" },
  { value: "Summit", label: "Summit" },
  { value: "Metropolis", label: "Metropolis" },
  { value: "Oasis", label: "Oasis" },
  { value: "Seasons", label: "Seasons" },
  { value: "Galaxy", label: "Galaxy" },
]

export function SongsTable() {
  const [songs, setSongs] = useState(mockSongs)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [selectedSong, setSelectedSong] = useState<any>(null)
  const [newSong, setNewSong] = useState({
    title: "",
    artist: "",
    album: "",
    genre: "",
    language: "",
    releaseDate: "",
    lyrics: "",
  })

  const filteredSongs = songs.filter(
    (song) =>
      song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddSong = () => {
    const id = (songs.length + 1).toString()
    setSongs([
      ...songs,
      {
        id,
        title: newSong.title,
        artist: newSong.artist,
        album: newSong.album,
        genre: newSong.genre,
        language: newSong.language,
        releaseDate: newSong.releaseDate,
        views: 0,
      },
    ])
    setNewSong({
      title: "",
      artist: "",
      album: "",
      genre: "",
      language: "",
      releaseDate: "",
      lyrics: "",
    })
    setIsAddDialogOpen(false)
  }

  const handleEditSong = () => {
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
            }
          : song,
      ),
    )
    setIsEditDialogOpen(false)
  }

  const handleDeleteSong = (id: string) => {
    setSongs(songs.filter((song) => song.id !== id))
    setIsDeleteDialogOpen(false)
  }

  const openEditDialog = (song: any) => {
    setSelectedSong(song)
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (song: any) => {
    setSelectedSong(song)
    setIsDeleteDialogOpen(true)
  }

  const openPreviewDialog = (song: any) => {
    setSelectedSong(song)
    setIsPreviewOpen(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search songs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-[250px]"
          />
          <Search className="h-4 w-4 text-muted-foreground" />
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
                      {mockArtistOptions.map((artist) => (
                        <SelectItem key={artist.value} value={artist.value}>
                          {artist.label}
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
                      {mockAlbumOptions.map((album) => (
                        <SelectItem key={album.value} value={album.value}>
                          {album.label}
                        </SelectItem>
                      ))}
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
                      <SelectItem value="Pop">Pop</SelectItem>
                      <SelectItem value="Rock">Rock</SelectItem>
                      <SelectItem value="Hip Hop">Hip Hop</SelectItem>
                      <SelectItem value="Electronic">Electronic</SelectItem>
                      <SelectItem value="Indie">Indie</SelectItem>
                      <SelectItem value="Folk">Folk</SelectItem>
                      <SelectItem value="R&B">R&B</SelectItem>
                      <SelectItem value="Jazz">Jazz</SelectItem>
                      <SelectItem value="Classical">Classical</SelectItem>
                      <SelectItem value="Country">Country</SelectItem>
                      <SelectItem value="World">World</SelectItem>
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
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Spanish">Spanish</SelectItem>
                      <SelectItem value="French">French</SelectItem>
                      <SelectItem value="German">German</SelectItem>
                      <SelectItem value="Italian">Italian</SelectItem>
                      <SelectItem value="Portuguese">Portuguese</SelectItem>
                      <SelectItem value="Japanese">Japanese</SelectItem>
                      <SelectItem value="Korean">Korean</SelectItem>
                      <SelectItem value="Chinese">Chinese</SelectItem>
                      <SelectItem value="Instrumental">Instrumental</SelectItem>
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
                  Please format the lyrics with line breaks for verses and choruses. Mark chorus sections with "Chorus:"
                  if possible.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddSong}>Add Song</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
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
            {filteredSongs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No songs found.
                </TableCell>
              </TableRow>
            ) : (
              filteredSongs.map((song) => (
                <TableRow key={song.id}>
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
            <div className="max-h-[60vh] overflow-y-auto whitespace-pre-line border p-4 rounded-md">{mockLyrics}</div>
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
                      {mockArtistOptions.map((artist) => (
                        <SelectItem key={artist.value} value={artist.value}>
                          {artist.label}
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
                      {mockAlbumOptions.map((album) => (
                        <SelectItem key={album.value} value={album.value}>
                          {album.label}
                        </SelectItem>
                      ))}
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
                      <SelectItem value="Pop">Pop</SelectItem>
                      <SelectItem value="Rock">Rock</SelectItem>
                      <SelectItem value="Hip Hop">Hip Hop</SelectItem>
                      <SelectItem value="Electronic">Electronic</SelectItem>
                      <SelectItem value="Indie">Indie</SelectItem>
                      <SelectItem value="Folk">Folk</SelectItem>
                      <SelectItem value="R&B">R&B</SelectItem>
                      <SelectItem value="Jazz">Jazz</SelectItem>
                      <SelectItem value="Classical">Classical</SelectItem>
                      <SelectItem value="Country">Country</SelectItem>
                      <SelectItem value="World">World</SelectItem>
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
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Spanish">Spanish</SelectItem>
                      <SelectItem value="French">French</SelectItem>
                      <SelectItem value="German">German</SelectItem>
                      <SelectItem value="Italian">Italian</SelectItem>
                      <SelectItem value="Portuguese">Portuguese</SelectItem>
                      <SelectItem value="Japanese">Japanese</SelectItem>
                      <SelectItem value="Korean">Korean</SelectItem>
                      <SelectItem value="Chinese">Chinese</SelectItem>
                      <SelectItem value="Instrumental">Instrumental</SelectItem>
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
                  defaultValue={mockLyrics}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditSong}>Save Changes</Button>
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

