"use client";

import { useState } from "react";
import { Music, Upload, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { db, storage } from "@/lib/firebase/config";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function SubmitLyricsForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const form = e.target as HTMLFormElement;
    const songTitle = (form.elements.namedItem("song-title") as HTMLInputElement).value;
    const artistName = (form.elements.namedItem("artist-name") as HTMLInputElement).value;
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
      if (coverImageFile) {
        const storageRef = ref(storage, `covers/${artistName}-${songTitle}-${coverImageFile.name}`);
        await uploadBytes(storageRef, coverImageFile);
        imageUrl = await getDownloadURL(storageRef);
      }

      await addDoc(collection(db, "lyricsSubmissions"), {
        songTitle,
        artistName,
        albumName,
        releaseDate,
        genre,
        language,
        lyrics,
        contributors,
        notes,
        imageUrl
      });

      setIsSubmitting(false);
      setIsSuccess(true);

      setTimeout(() => {
        setIsSuccess(false);
        form.reset();
      }, 3000);
    } catch (err: any) {
      setIsSubmitting(false);
      setError(err.message || "An error occurred while submitting lyrics.");
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

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Song Information</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="song-title">Song Title *</Label>
              <Input id="song-title" name="song-title" placeholder="Enter song title" required className="rounded-[4px]" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="artist-name">Artist Name *</Label>
              <Input id="artist-name" name="artist-name" placeholder="Enter artist name" required className="rounded-[4px]" />
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
                  <SelectItem value="spanish">Spanish</SelectItem>
                  <SelectItem value="french">French</SelectItem>
                  <SelectItem value="german">German</SelectItem>
                  <SelectItem value="italian">Italian</SelectItem>
                  <SelectItem value="portuguese">Portuguese</SelectItem>
                  <SelectItem value="japanese">Japanese</SelectItem>
                  <SelectItem value="korean">Korean</SelectItem>
                  <SelectItem value="chinese">Chinese</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
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
              {isSubmitting ? "Submitting..." : "Submit Lyrics"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}