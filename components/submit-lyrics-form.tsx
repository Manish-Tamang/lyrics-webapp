"use client";

import { useState, useRef, useEffect } from "react";
import { Music, Upload, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { db, storage } from "@/lib/firebase/config";
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "sonner";

export default function SubmitLyricsForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [artists, setArtists] = useState<{ id: string; name: string }[]>([]);
  const [isLoadingArtists, setIsLoadingArtists] = useState(true);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const artistsQuery = query(collection(db, "artists"), orderBy("name"));
        const querySnapshot = await getDocs(artistsQuery);
        const artistsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name
        }));
        setArtists(artistsList);
      } catch (error) {
        console.error("Error fetching artists:", error);
        toast.error("Failed to load artists list");
      } finally {
        setIsLoadingArtists(false);
      }
    };

    fetchArtists();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setUploadProgress(null);

    const form = e.target as HTMLFormElement;
    const songTitle = (form.elements.namedItem("song-title") as HTMLInputElement).value;
    const artistId = (form.elements.namedItem("artist-id") as HTMLSelectElement).value;
    const albumName = (form.elements.namedItem("album-name") as HTMLInputElement).value;
    const releaseDate = (form.elements.namedItem("release-date") as HTMLInputElement).value;
    const genre = (form.elements.namedItem("genre") as HTMLSelectElement).value;
    const language = (form.elements.namedItem("language") as HTMLSelectElement).value;
    const lyrics = (form.elements.namedItem("lyrics") as HTMLTextAreaElement).value;
    const contributors = (form.elements.namedItem("contributors") as HTMLInputElement).value;
    const notes = (form.elements.namedItem("notes") as HTMLTextAreaElement).value;
    const coverImageFile = (form.elements.namedItem("cover-image") as HTMLInputElement).files?.[0];

    let imageUrl = null;

    try {
      // Validate file size if an image is uploaded
      if (coverImageFile && coverImageFile.size > 2 * 1024 * 1024) {
        throw new Error("Cover image must be less than 2MB");
      }

      // Upload image if provided
      if (coverImageFile) {
        setUploadProgress(0);
        const storageRef = ref(storage, `covers/${Date.now()}-${artistId}-${songTitle}-${coverImageFile.name}`);
        await uploadBytes(storageRef, coverImageFile);
        setUploadProgress(50);
        imageUrl = await getDownloadURL(storageRef);
        setUploadProgress(100);
      }

      // Add document to Firestore
      const docRef = await addDoc(collection(db, "lyricsSubmissions"), {
        songTitle,
        artistId,
        albumName,
        releaseDate,
        genre,
        language,
        lyrics,
        contributors,
        notes,
        imageUrl,
        status: "pending", // For admin review
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      setIsSubmitting(false);
      setIsSuccess(true);
      toast.success("Lyrics submitted successfully!");

      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSuccess(false);
        if (formRef.current) {
          formRef.current.reset();
        }
      }, 3000);
    } catch (err: any) {
      setIsSubmitting(false);
      setUploadProgress(null);
      const errorMessage = err.message || "An error occurred while submitting lyrics.";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <div className="rounded-[4px] border bg-card p-6">
      {isSuccess && (
        <Alert className="mb-6 rounded-[4px] border-green-500 bg-green-50 text-green-800">
          <Music className="h-4 w-4" />
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>
            Your lyrics have been submitted successfully. Thank you for your contribution!
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="mb-6 rounded-[4px] border-red-500 bg-red-50 text-red-800">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Song Information</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="song-title">Song Title *</Label>
              <Input id="song-title" name="song-title" placeholder="Enter song title" required className="rounded-[4px]" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="artist-id">Artist Name *</Label>
              <Select required name="artist-id">
                <SelectTrigger id="artist-id" className="rounded-[4px]">
                  <SelectValue placeholder={isLoadingArtists ? "Loading artists..." : "Select artist"} />
                </SelectTrigger>
                <SelectContent className="rounded-[4px]">
                  {isLoadingArtists ? (
                    <SelectItem value="loading" disabled>
                      Loading artists...
                    </SelectItem>
                  ) : (
                    artists.map((artist) => (
                      <SelectItem key={artist.id} value={artist.id}>
                        {artist.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="album-name">Album Name</Label>
              <Input id="album-name" name="album-name" placeholder="Enter album name (optional)" className="rounded-[4px]" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="release-date">Release Date</Label>
              <Input id="release-date" name="release-date" type="date" className="rounded-[4px]" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="genre">Genre *</Label>
              <Select required name="genre">
                <SelectTrigger id="genre" className="rounded-[4px]">
                  <SelectValue placeholder="Select genre" />
                </SelectTrigger>
                <SelectContent className="rounded-[4px]">
                  <SelectItem value="pop">Pop</SelectItem>
                  <SelectItem value="rock">Rock</SelectItem>
                  <SelectItem value="hip-hop">Hip Hop</SelectItem>
                  <SelectItem value="electronic">Electronic</SelectItem>
                  <SelectItem value="indie">Indie</SelectItem>
                  <SelectItem value="folk">Folk</SelectItem>
                  <SelectItem value="r-and-b">R&B</SelectItem>
                  <SelectItem value="jazz">Jazz</SelectItem>
                  <SelectItem value="classical">Classical</SelectItem>
                  <SelectItem value="country">Country</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Language *</Label>
              <Select required name="language">
                <SelectTrigger id="language" className="rounded-[4px]">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent className="rounded-[4px]">
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="nepali">Nepali</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Lyrics</h2>

          <div className="space-y-2">
            <Label htmlFor="lyrics">Song Lyrics *</Label>
            <Textarea
              id="lyrics"
              name="lyrics"
              placeholder="Enter the song lyrics here..."
              required
              className="min-h-[300px] rounded-[4px]"
            />
            <p className="text-xs text-muted-foreground">
              Please format the lyrics with line breaks for verses and choruses. Mark chorus sections with "Chorus:" if
              possible.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Additional Information</h2>

          <div className="space-y-2">
            <Label htmlFor="contributors">Contributors</Label>
            <Input
              id="contributors"
              name="contributors"
              placeholder="Songwriters, producers, etc. (comma separated)"
              className="rounded-[4px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cover-image">Cover Image</Label>
            <div className="flex items-center gap-2">
              <Input id="cover-image" name="cover-image" type="file" accept="image/*" className="rounded-[4px]" />
              {uploadProgress !== null && (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-xs">{uploadProgress}%</span>
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">Upload album or single cover art (optional). Max size: 2MB.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea id="notes" name="notes" placeholder="Any additional information about the song..." className="rounded-[4px]" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[4px] border bg-muted p-4">
            <p className="text-sm">
              By submitting lyrics, you confirm that you are not violating any copyright laws and that you have the
              right to share these lyrics. LyricVerse reserves the right to edit or remove content that violates our
              terms of service.
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              className="rounded-[4px]"
              onClick={() => (window.location.href = "/")}
            >
              Cancel
            </Button>
            <Button type="submit" className="rounded-[4px]" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Lyrics"
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}