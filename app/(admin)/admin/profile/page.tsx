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
import { Home } from "lucide-react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";

const ITEMS_PER_PAGE = 5;

export default function AdminProfilePage() {
    const { data: session } = useSession();
    const [contributions, setContributions] = useState<Song[]>([]);
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState<any>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

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

    // Calculate pagination
    useEffect(() => {
        const totalItems = contributions.length;
        const pages = Math.ceil(totalItems / ITEMS_PER_PAGE);
        setTotalPages(pages);
        if (currentPage > pages && pages > 0) {
            setCurrentPage(1);
        }
    }, [contributions, currentPage]);

    // Get paginated contributions
    const paginatedContributions = contributions.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="grid gap-8 md:grid-cols-3">
                    <Card className="md:col-span-1">
                        <CardHeader>
                            <div className="flex flex-col items-center space-y-4">
                                <Skeleton className="h-24 w-24 rounded-full" />
                                <Skeleton className="h-8 w-32" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                        </CardHeader>
                    </Card>
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <Skeleton className="h-6 w-32" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {[...Array(3)].map((_, i) => (
                                    <Skeleton key={i} className="h-20 w-full" />
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }
    return (
        <div className="container mx-auto px-4 py-8">
            {/* Breadcrumb */}
            <Breadcrumb className="mb-6">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/admin">
                            <Home className="h-4 w-4" />
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Profile</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="grid gap-8 md:grid-cols-3">
                {/* Profile Card */}
                <Card className="md:col-span-1">
                    <CardHeader>
                        <div className="flex flex-col items-center space-y-4">
                            <Avatar className="h-20 w-20">
                                <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || ""} />
                                <AvatarFallback>{session?.user?.name?.charAt(0) || "A"}</AvatarFallback>
                            </Avatar>
                            <div className="text-center">
                                <h2 className="text-xl font-bold">{session?.user?.name || "Admin"}</h2>
                                <p className="text-sm text-muted-foreground">{session?.user?.email}</p>
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

                {/* Contributions Card */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Recent Contributions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {paginatedContributions.length === 0 ? (
                                <p className="text-muted-foreground">No contributions yet</p>
                            ) : (
                                paginatedContributions.map((song) => (
                                    <div key={song.id} className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium truncate">{song.title}</h3>
                                            <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
                                        </div>
                                        <div className="flex items-center gap-2 ml-4">
                                            <Badge variant="outline" className="text-xs">
                                                {song.genre}
                                            </Badge>
                                            <p className="text-xs text-muted-foreground whitespace-nowrap">
                                                {song.createdAt ? format(
                                                    song.createdAt instanceof Timestamp
                                                        ? song.createdAt.toDate()
                                                        : new Date(song.createdAt),
                                                    "MMM d, yyyy"
                                                ) : "N/A"}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center mt-6">
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
                    </CardContent>
                </Card>
            </div>
        </div>
    );
} 