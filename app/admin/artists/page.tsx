"use client"

import { useState } from "react"
import { PlusCircle, Search, Edit, Trash2 } from "lucide-react"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Mock data for artists
const mockArtists = [
  {
    id: "1",
    name: "Luna Eclipse",
    bio: "Luna Eclipse is an indie pop artist known for dreamy vocals and atmospheric production.",
    songCount: 12,
    albumCount: 2,
    imageUrl: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    name: "Coastal Sounds",
    bio: "Coastal Sounds creates laid-back indie folk inspired by ocean landscapes.",
    songCount: 24,
    albumCount: 3,
    imageUrl: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "3",
    name: "Alpine Echoes",
    bio: "Alpine Echoes is a folk collective that draws inspiration from mountain landscapes.",
    songCount: 18,
    albumCount: 2,
    imageUrl: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "4",
    name: "Urban Vibes",
    bio: "Urban Vibes blends electronic and hip-hop elements to create modern city soundscapes.",
    songCount: 32,
    albumCount: 4,
    imageUrl: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "5",
    name: "Sandy Tunes",
    bio: "Sandy Tunes creates world music influenced by desert landscapes and cultures.",
    songCount: 15,
    albumCount: 1,
    imageUrl: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "6",
    name: "Weather Patterns",
    bio: "Weather Patterns is an experimental jazz ensemble that explores natural phenomena through sound.",
    songCount: 22,
    albumCount: 2,
    imageUrl: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "7",
    name: "Cosmic Harmony",
    bio: "Cosmic Harmony creates ambient electronic music inspired by space and astronomy.",
    songCount: 28,
    albumCount: 3,
    imageUrl: "/placeholder.svg?height=40&width=40",
  },
]

export default function ArtistsPage() {
  const [artists, setArtists] = useState(mockArtists)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedArtist, setSelectedArtist] = useState<any>(null)
  const [newArtist, setNewArtist] = useState({
    name: "",
    bio: "",
    imageUrl: "/placeholder.svg?height=40&width=40",
  })

  const filteredArtists = artists.filter((artist) => artist.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleAddArtist = () => {
    const id = (artists.length + 1).toString()
    setArtists([
      ...artists,
      {
        id,
        name: newArtist.name,
        bio: newArtist.bio,
        songCount: 0,
        albumCount: 0,
        imageUrl: newArtist.imageUrl,
      },
    ])
    setNewArtist({
      name: "",
      bio: "",
      imageUrl: "/placeholder.svg?height=40&width=40",
    })
    setIsAddDialogOpen(false)
  }

  const handleEditArtist = () => {
    setArtists(
      artists.map((artist) =>
        artist.id === selectedArtist.id ? { ...artist, name: selectedArtist.name, bio: selectedArtist.bio } : artist,
      ),
    )
    setIsEditDialogOpen(false)
  }

  const handleDeleteArtist = (id: string) => {
    setArtists(artists.filter((artist) => artist.id !== id))
    setIsDeleteDialogOpen(false)
  }

  const openEditDialog = (artist: any) => {
    setSelectedArtist(artist)
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (artist: any) => {
    setSelectedArtist(artist)
    setIsDeleteDialogOpen(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <h1 className="text-2xl font-bold tracking-tight">Artists Management</h1>
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search artists..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-[250px]"
            icon={<Search className="h-4 w-4" />}
          />
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Artist
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Artist</DialogTitle>
                <DialogDescription>Enter the details for the new artist.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Artist Name</Label>
                  <Input
                    id="name"
                    value={newArtist.name}
                    onChange={(e) => setNewArtist({ ...newArtist, name: e.target.value })}
                    placeholder="Enter artist name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="bio">Biography</Label>
                  <Textarea
                    id="bio"
                    value={newArtist.bio}
                    onChange={(e) => setNewArtist({ ...newArtist, bio: e.target.value })}
                    placeholder="Enter artist biography"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="image">Artist Image</Label>
                  <Input id="image" type="file" accept="image/*" />
                  <p className="text-xs text-muted-foreground">Upload an image for the artist (optional).</p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddArtist}>Add Artist</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Artist</TableHead>
              <TableHead>Biography</TableHead>
              <TableHead>Songs</TableHead>
              <TableHead>Albums</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredArtists.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No artists found.
                </TableCell>
              </TableRow>
            ) : (
              filteredArtists.map((artist) => (
                <TableRow key={artist.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={artist.imageUrl} alt={artist.name} />
                        <AvatarFallback>{artist.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="font-medium">{artist.name}</div>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-md truncate">{artist.bio}</TableCell>
                  <TableCell>{artist.songCount}</TableCell>
                  <TableCell>{artist.albumCount}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-blue-500"
                        onClick={() => openEditDialog(artist)}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500"
                        onClick={() => openDeleteDialog(artist)}
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

      {/* Edit Dialog */}
      {selectedArtist && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Artist</DialogTitle>
              <DialogDescription>Update the details for {selectedArtist.name}.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Artist Name</Label>
                <Input
                  id="edit-name"
                  value={selectedArtist.name}
                  onChange={(e) =>
                    setSelectedArtist({
                      ...selectedArtist,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-bio">Biography</Label>
                <Textarea
                  id="edit-bio"
                  value={selectedArtist.bio}
                  onChange={(e) =>
                    setSelectedArtist({
                      ...selectedArtist,
                      bio: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-image">Artist Image</Label>
                <Input id="edit-image" type="file" accept="image/*" />
                <div className="flex items-center space-x-3 mt-2">
                  <Avatar>
                    <AvatarImage src={selectedArtist.imageUrl} alt={selectedArtist.name} />
                    <AvatarFallback>{selectedArtist.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <p className="text-xs text-muted-foreground">Current image</p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditArtist}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      {selectedArtist && (
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete {selectedArtist.name}? This will also remove all associated songs and
                albums. This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={() => handleDeleteArtist(selectedArtist.id)}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

