"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Overview } from "@/components/admin/overview"
import { RecentSubmissions } from "@/components/admin/recent-submissions"
import { SubmissionsTable } from "@/components/admin/submissions-table"
import { ArtistsTable } from "@/components/admin/artists-table"
import { SongsTable } from "@/components/admin/songs-table"
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase/config";
import { collection, getDocs } from "firebase/firestore";

export default function AdminDashboard() {
 const [submissionCount, setSubmissionCount] = useState(0);

 useEffect(() => {
   fetchSubmissionCount();
 }, []);

 const fetchSubmissionCount = async () => {
   try {
     const querySnapshot = await getDocs(collection(db, "submissions"));
     setSubmissionCount(querySnapshot.size);
   } catch (error) {
     console.error("Error fetching submission count:", error);
   }
 };
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Songs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,248</div>
                <p className="text-xs text-muted-foreground">+24 from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Artists</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">324</div>
                <p className="text-xs text-muted-foreground">+12 from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Submissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{submissionCount}</div>
                <p className="text-xs text-muted-foreground">+4 since yesterday</p>
              </CardContent>
            </Card>
          </div>
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
                <CardDescription>You have {submissionCount} submissions waiting for review</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentSubmissions />
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
              <SubmissionsTable />
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
              <ArtistsTable />
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
              <SongsTable />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}