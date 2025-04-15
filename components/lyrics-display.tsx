"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Check, Heart } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

interface LyricsDisplayProps {
  lyrics: string
  contributors?: string[] | string
}

export default function LyricsDisplay({ lyrics, contributors }: LyricsDisplayProps) {
  const [copied, setCopied] = useState(false)
  const [liked, setLiked] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(lyrics)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Convert contributors to array if it's a string
  const contributorsArray = Array.isArray(contributors) 
    ? contributors 
    : contributors 
      ? [contributors] 
      : []

  return (
    <Card className="rounded-[4px]">
      <CardHeader className="flex flex-row items-center justify-between border-b p-4">
        <h2 className="text-xl font-semibold">Lyrics</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="rounded-[4px]" onClick={() => setLiked(!liked)}>
            <Heart className={`mr-1 h-4 w-4 ${liked ? "fill-red-500 text-red-500" : ""}`} />
            {liked ? "Liked" : "Like"}
          </Button>
          <Button variant="outline" size="sm" className="rounded-[4px]" onClick={copyToClipboard}>
            {copied ? (
              <>
                <Check className="mr-1 h-4 w-4" /> Copied
              </>
            ) : (
              <>
                <Copy className="mr-1 h-4 w-4" /> Copy
              </>
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="whitespace-pre-line text-lg leading-relaxed">{lyrics}</div>
      </CardContent>

      {contributorsArray.length > 0 && (
        <div className="border-t p-4">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">Contributors:</span> {contributorsArray.join(", ")}
          </p>
        </div>
      )}
    </Card>
  )
}

