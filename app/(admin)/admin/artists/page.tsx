"use client"

import { useState, useEffect, useRef } from "react"
import { PlusCircle, Search, Edit, Trash2, Home } from "lucide-react"
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
  serverTimestamp
} from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

// Artist type definition
interface Artist {
  id: string;
  name: string;
  bio: string;
  songCount: number;
  albumCount: number;
  imageUrl: string;
  createdAt?: any;
  updatedAt?: any;
}

const TableSkeleton = () => (
  <TableRow>
    <TableCell>
      <div className="flex items-center space-x-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-4 w-[120px]" />
      </div>
    </TableCell>
    <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
    <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
    <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
    <TableCell className="text-right">
      <div className="flex justify-end space-x-1">
        <Skeleton className="h-8 w-8 rounded-md" />
        <Skeleton className="h-8 w-8 rounded-md" />
      </div>
    </TableCell>
  </TableRow>
);

const ITEMS_PER_PAGE = 5;

export default function ArtistsPage() {
  const [artists, setArtists] = useState<Artist[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null)
  const [newArtist, setNewArtist] = useState({
    name: "",
    bio: "",
    imageUrl: "/placeholder.svg?height=40&width=40",
  })
  const [loading, setLoading] = useState(true)
  const [uploadingImage, setUploadingImage] = useState(false)
  const addImageRef = useRef<HTMLInputElement>(null)
  const editImageRef = useRef<HTMLInputElement>(null)
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch artists from Firebase
  useEffect(() => {
    const fetchArtists = async () => {
      try {
        setLoading(true)
        const artistsQuery = query(collection(db, "artists"), orderBy("createdAt", "desc"))
        const querySnapshot = await getDocs(artistsQuery)
        
        const artistsData: Artist[] = []
        querySnapshot.forEach((doc) => {
          const artistData = { id: doc.id, ...doc.data() } as Artist
          artistsData.push(artistData)
        })
        
        setArtists(artistsData)
      } catch (error) {
        console.error("Error fetching artists:", error)
        toast.error("Failed to load artists")
      } finally {
        setLoading(false)
      }
    }

    fetchArtists()
  }, [])

  const filteredArtists = artists.filter((artist) => artist.name.toLowerCase().includes(searchTerm.toLowerCase()))

  // Calculate pagination
  useEffect(() => {
    const totalItems = filteredArtists.length;
    const pages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    setTotalPages(pages);
    // Reset to first page if current page is out of bounds
    if (currentPage > pages && pages > 0) {
      setCurrentPage(1);
    }
  }, [filteredArtists, currentPage]);

  // Get paginated artists
  const paginatedArtists = filteredArtists.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const uploadImage = async (file: File, artistId: string): Promise<string> => {
    try {
      setUploadingImage(true)
      const storageRef = ref(storage, `artists/${artistId}/${file.name}`)
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

  const handleAddArtist = async () => {
    try {
      setLoading(true)
      
      // Validate required fields
      if (!newArtist.name) {
        toast.error("Artist name is required")
        return
      }
      
      const artistData = {
        name: newArtist.name,
        bio: newArtist.bio,
        songCount: 0,
        albumCount: 0,
        imageUrl: newArtist.imageUrl,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }
      
      const docRef = await addDoc(collection(db, "artists"), artistData)
      
      let imageUrl = newArtist.imageUrl
      
      if (addImageRef.current?.files && addImageRef.current.files[0]) {
        try {
          imageUrl = await uploadImage(addImageRef.current.files[0], docRef.id)
          await updateDoc(doc(db, "artists", docRef.id), { imageUrl })
        } catch (error) {
          console.error("Error uploading image:", error)
        }
      }
      
      // Add the new artist to the state with the generated ID
      const newArtistWithId = {
        ...artistData,
        id: docRef.id,
        songCount: 0,
        albumCount: 0,
        imageUrl
      } as Artist
      
      setArtists([newArtistWithId, ...artists])
      
      // Reset form
      setNewArtist({
        name: "",
        bio: "",
        imageUrl: "/placeholder.svg?height=40&width=40",
      })
      
      if (addImageRef.current) {
        addImageRef.current.value = ""
      }
      
      setIsAddDialogOpen(false)
      toast.success("Artist added successfully")
    } catch (error) {
      console.error("Error adding artist:", error)
      toast.error("Failed to add artist")
    } finally {
      setLoading(false)
    }
  }

  const handleEditArtist = async () => {
    if (!selectedArtist) return
    
    try {
      setLoading(true)
      
      // Validate required fields
      if (!selectedArtist.name) {
        toast.error("Artist name is required")
        return
      }
      
      let imageUrl = selectedArtist.imageUrl
      
      if (editImageRef.current?.files && editImageRef.current.files[0]) {
        try {
          imageUrl = await uploadImage(editImageRef.current.files[0], selectedArtist.id)
        } catch (error) {
          console.error("Error uploading image:", error)
        }
      }
      
      const artistRef = doc(db, "artists", selectedArtist.id)
      await updateDoc(artistRef, {
        name: selectedArtist.name,
        bio: selectedArtist.bio,
        imageUrl,
        updatedAt: serverTimestamp()
      })
      
      // Update the artist in the state
      setArtists(
        artists.map((artist) =>
          artist.id === selectedArtist.id 
            ? { 
                ...artist, 
                name: selectedArtist.name, 
                bio: selectedArtist.bio,
                imageUrl,
                updatedAt: new Date()
              } 
            : artist
        )
      )
      
      if (editImageRef.current) {
        editImageRef.current.value = ""
      }
      
      setIsEditDialogOpen(false)
      toast.success("Artist updated successfully")
    } catch (error) {
      console.error("Error updating artist:", error)
      toast.error("Failed to update artist")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteArtist = async (id: string) => {
    try {
      setLoading(true)
      
      await deleteDoc(doc(db, "artists", id))
      
      // Remove the artist from the state
      setArtists(artists.filter((artist) => artist.id !== id))
      
      setIsDeleteDialogOpen(false)
      toast.success("Artist deleted successfully")
    } catch (error) {
      console.error("Error deleting artist:", error)
      toast.error("Failed to delete artist")
    } finally {
      setLoading(false)
    }
  }

  const openEditDialog = (artist: Artist) => {
    setSelectedArtist(artist)
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (artist: Artist) => {
    setSelectedArtist(artist)
    setIsDeleteDialogOpen(true)
  }

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin">
              <Home className="h-4 w-4" />
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Artists</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <h1 className="text-2xl font-bold tracking-tight">Artists Management</h1>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search artists..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-[250px] pl-8"
            />
          </div>
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
                  <Input 
                    id="image" 
                    type="file" 
                    accept="image/*" 
                    ref={addImageRef}
                  />
                  <p className="text-xs text-muted-foreground">Upload an image for the artist (optional).</p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddArtist} disabled={loading || uploadingImage}>
                  {loading || uploadingImage ? "Adding..." : "Add Artist"}
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
              <TableHead>Artist</TableHead>
              <TableHead>Biography</TableHead>
              <TableHead>Songs</TableHead>
              <TableHead>Albums</TableHead>
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
            ) : paginatedArtists.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No artists found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedArtists.map((artist) => (
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => handlePageChange(page)}
                    isActive={currentPage === page}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

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
                <Input 
                  id="edit-image" 
                  type="file" 
                  accept="image/*" 
                  ref={editImageRef}
                />
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
              <Button onClick={handleEditArtist} disabled={loading || uploadingImage}>
                {loading || uploadingImage ? "Saving..." : "Save Changes"}
              </Button>
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
              <Button variant="destructive" onClick={() => handleDeleteArtist(selectedArtist.id)} disabled={loading}>
                {loading ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

