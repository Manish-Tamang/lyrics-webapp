"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { db } from "@/lib/firebase/config";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Song } from "@/types";
import { Timestamp } from "firebase/firestore";

export default function AdminProfilePage() {
    const { data: session } = useSession();
    const [contributions, setContributions] = useState<Song[]>([]);
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState<any>(null);

    useEffect(() => {
        const fetchProfileData = async () => {
            if (!session?.user?.email) return;

            try {

                const userDoc = await getDoc(doc(db, "users", session.user.email));
                if (userDoc.exists()) {
                    setUserData(userDoc.data());
                }


                const songsQuery = query(
                    collection(db, "songs"),
                    where("contributors", "array-contains", session.user.email)
                );
                const songsSnapshot = await getDocs(songsQuery);
                const songsData = songsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Song[];

                setContributions(songsData);
            } catch (error) {
                console.error("Error fetching profile data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [session]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid gap-8 md:grid-cols-3">
                { }
                <Card className="md:col-span-1">
                    <CardHeader>
                        <div className="flex flex-col items-center space-y-4">
                            <Avatar className="h-24 w-24">
                                <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || ""} />
                                <AvatarFallback>{session?.user?.name?.charAt(0) || "A"}</AvatarFallback>
                            </Avatar>
                            <div className="text-center">
                                <h2 className="text-2xl font-bold">{session?.user?.name || "Admin"}</h2>
                                <p className="text-muted-foreground">{session?.user?.email}</p>
                            </div>
                            <Badge variant="outline" className="text-sm">
                                Admin
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-sm font-medium">Contributions</h3>
                                <p className="text-2xl font-bold">{contributions.length}</p>
                            </div>
                            {userData?.lastContribution && (
                                <div>
                                    <h3 className="text-sm font-medium">Last Contribution</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {format(userData.lastContribution.toDate(), "MMM d, yyyy")}
                                    </p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                { }
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Recent Contributions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {contributions.length === 0 ? (
                                <p className="text-muted-foreground">No contributions yet</p>
                            ) : (
                                contributions.map((song) => (
                                    <div key={song.id} className="flex items-center justify-between rounded-lg border p-4">
                                        <div>
                                            <h3 className="font-medium">{song.title}</h3>
                                            <p className="text-sm text-muted-foreground">{song.artist}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-muted-foreground">
                                                {song.createdAt ? format(
                                                    song.createdAt instanceof Timestamp 
                                                        ? song.createdAt.toDate() 
                                                        : new Date(song.createdAt), 
                                                    "MMM d, yyyy"
                                                ) : "N/A"}
                                            </p>
                                            <Badge variant="outline" className="mt-1">
                                                {song.genre}
                                            </Badge>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
} 