import type { Metadata } from "next"
import SubmitLyricsForm from "@/components/submit-lyrics-form"

export const metadata: Metadata = {
  title: "Submit Lyrics | LyricVerse",
  description: "Contribute lyrics to our collection",
}

export default function SubmitLyricsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Submit Lyrics</h1>
        <p className="mt-2 text-muted-foreground">
          Contribute to our growing collection of lyrics by submitting your own.
        </p>
      </div>

      <SubmitLyricsForm />
    </div>
  )
}

