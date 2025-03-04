"use client"

import type React from "react"

import { useState } from "react"
import { Music, Upload, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function SubmitLyricsForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)

      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSuccess(false)
        const form = e.target as HTMLFormElement
        form.reset()
      }, 3000)
    }, 1500)
  }

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
              <Input id="song-title" placeholder="Enter song title" required className="rounded-[4px]" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="artist-name">Artist Name *</Label>
              <Input id="artist-name" placeholder="Enter artist name" required className="rounded-[4px]" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="album-name">Album Name</Label>
              <Input id="album-name" placeholder="Enter album name (optional)" className="rounded-[4px]" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="release-date">Release Date</Label>
              <Input id="release-date" type="date" className="rounded-[4px]" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="genre">Genre *</Label>
              <Select required>
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
              <Select required>
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
              placeholder="Songwriters, producers, etc. (comma separated)"
              className="rounded-[4px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cover-image">Cover Image</Label>
            <div className="flex items-center gap-2">
              <Input id="cover-image" type="file" accept="image/*" className="rounded-[4px]" />
              <Button type="button" variant="outline" size="icon" className="rounded-[4px]">
                <Upload className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Upload album or single cover art (optional). Max size: 2MB.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea id="notes" placeholder="Any additional information about the song..." className="rounded-[4px]" />
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
  )
}

