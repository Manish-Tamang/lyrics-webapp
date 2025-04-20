import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { db } from "@/lib/firebase/config"
import { collection, getDocs, query, where } from "firebase/firestore"

export function StatsCards() {
  const [stats, setStats] = useState({
    totalSongs: 0,
    totalArtists: 0,
    pendingSubmissions: 0
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [songsSnapshot, artistsSnapshot, submissionsSnapshot] = await Promise.all([
          getDocs(collection(db, "songs")),
          getDocs(collection(db, "artists")),
          getDocs(query(collection(db, "submissions"), where("status", "==", "pending")))
        ])

        setStats({
          totalSongs: songsSnapshot.size,
          totalArtists: artistsSnapshot.size,
          pendingSubmissions: submissionsSnapshot.size
        })
      } catch (error) {
        console.error("Error fetching stats:", error)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Songs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalSongs}</div>
          <p className="text-xs text-muted-foreground">+24 from last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Artists</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalArtists}</div>
          <p className="text-xs text-muted-foreground">+12 from last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.pendingSubmissions}</div>
          <p className="text-xs text-muted-foreground">+4 since yesterday</p>
        </CardContent>
      </Card>
    </div>
  )
} 