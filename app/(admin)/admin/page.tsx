"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Overview } from "@/components/admin/overview"
import { RecentSubmissions } from "@/components/admin/recent-submissions"
import { SubmissionsTable } from "@/components/admin/submissions-table"
import { ArtistsTable } from "@/components/admin/artists-table"
import { SongsTable } from "@/components/admin/songs-table"
import { StatsCards } from "@/components/admin/stats-cards"
import { useEffect, useState } from "react"
import { db } from "@/lib/firebase/config"
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore"
import { Submission } from "@/types"

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

interface Artist {
  id: string
  name: string
  bio: string
  songCount: number
  albumCount: number
  imageUrl: string
  createdAt: Date | null
  updatedAt: Date | null
}

export default function AdminDashboard() {
  const [recentSubmissions, setRecentSubmissions] = useState<Submission[]>([])
  const [songs, setSongs] = useState<Song[]>([])
  const [artists, setArtists] = useState<Artist[]>([])
  const [allSubmissions, setAllSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          submissionsSnapshot,
          songsSnapshot,
          artistsSnapshot,
          allSubmissionsSnapshot
        ] = await Promise.all([
          getDocs(query(collection(db, "submissions"), orderBy("createdAt", "desc"), limit(5))),
          getDocs(query(collection(db, "songs"), orderBy("createdAt", "desc"))),
          getDocs(query(collection(db, "artists"), orderBy("createdAt", "desc"))),
          getDocs(query(collection(db, "submissions"), orderBy("createdAt", "desc")))
        ])

        const submissions = submissionsSnapshot.docs.map(doc => ({
          id: doc.id,
          songTitle: doc.data().songTitle,
          artistName: doc.data().artistName,
          albumName: doc.data().albumName,
          releaseDate: doc.data().releaseDate,
          genre: doc.data().genre,
          language: doc.data().language,
          lyrics: doc.data().lyrics,
          contributors: doc.data().contributors || '',
          notes: doc.data().notes || '',
          imageUrl: doc.data().imageUrl || null
        })) as Submission[]

        const songsData = songsSnapshot.docs.map(doc => ({
          id: doc.id,
          title: doc.data().title,
          artist: doc.data().artist,
          lyrics: doc.data().lyrics,
          genre: doc.data().genre,
          duration: doc.data().duration,
          releaseDate: doc.data().releaseDate ? new Date(doc.data().releaseDate) : null,
          imageUrl: doc.data().imageUrl,
          audioUrl: doc.data().audioUrl,
          createdAt: doc.data().createdAt?.toDate() || null,
          updatedAt: doc.data().updatedAt?.toDate() || null
        })) as Song[]

        const artistsData = artistsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || null,
          updatedAt: doc.data().updatedAt?.toDate() || null
        })) as Artist[]

        const allSubmissionsData = allSubmissionsSnapshot.docs.map(doc => ({
          id: doc.id,
          songTitle: doc.data().songTitle,
          artistName: doc.data().artistName,
          albumName: doc.data().albumName,
          releaseDate: doc.data().releaseDate,
          genre: doc.data().genre,
          language: doc.data().language,
          lyrics: doc.data().lyrics,
          contributors: doc.data().contributors || '',
          notes: doc.data().notes || '',
          imageUrl: doc.data().imageUrl || null
        })) as Submission[]

        setRecentSubmissions(submissions)
        setSongs(songsData)
        setArtists(artistsData)
        setAllSubmissions(allSubmissionsData)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="flex flex-col space-y-6">
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
          <TabsTrigger value="artists">Artists</TabsTrigger>
          <TabsTrigger value="songs">Songs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <StatsCards />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Submissions</CardTitle>
                <CardDescription>You have {recentSubmissions.length} submissions waiting for review</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentSubmissions submissions={recentSubmissions} loading={loading} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="submissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Submissions Management</CardTitle>
              <CardDescription>Review and manage user-submitted lyrics</CardDescription>
            </CardHeader>
            <CardContent>
              <SubmissionsTable submissions={allSubmissions} loading={loading} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="artists" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Artists Management</CardTitle>
              <CardDescription>Add, edit, and manage artists</CardDescription>
            </CardHeader>
            <CardContent>
              <ArtistsTable artists={artists} loading={loading} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="songs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Songs Management</CardTitle>
              <CardDescription>Add, edit, and manage songs and lyrics</CardDescription>
            </CardHeader>
            <CardContent>
              <SongsTable songs={songs} loading={loading} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}