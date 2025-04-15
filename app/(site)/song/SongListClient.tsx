"use client";

import SongCard from "@/components/song-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"; 
import { useState, useEffect, useMemo } from "react";
import { db } from "@/lib/firebase/config";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { Song } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

const SongCardSkeleton = () => (
    <div className="rounded-lg border bg-card p-4">
        <Skeleton className="aspect-square w-full rounded-md" />
        <div className="mt-4 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
        </div>
    </div>
);

const ITEMS_PER_PAGE = 9; // Define how many songs per page

const SongListClient: React.FC = () => {
    const [allSongs, setAllSongs] = useState<Song[]>([]); // Store all fetched songs
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<string>("all"); // Track the active tab
    const [currentPage, setCurrentPage] = useState<number>(1); // Track the current page

    useEffect(() => {
        fetchSongs();
    }, []);

    const fetchSongs = async () => {
        setLoading(true);
        setError(null); // Reset error on new fetch
        setCurrentPage(1); // Reset page on new fetch/reload
        try {
            // Cache logic remains the same
            const cachedSongs = localStorage.getItem('cachedSongs');
            const cacheTimestamp = localStorage.getItem('songsCacheTimestamp');
            const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

            if (cachedSongs && cacheTimestamp) {
                const timestamp = parseInt(cacheTimestamp);
                if (Date.now() - timestamp < CACHE_DURATION) {
                    setAllSongs(JSON.parse(cachedSongs));
                    setLoading(false);
                    return;
                }
            }

            // Fetch from Firestore
            const songsQuery = query(collection(db, "songs"), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(songsQuery);

            const songsData: Song[] = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Song[];

            // Update cache
            localStorage.setItem('cachedSongs', JSON.stringify(songsData));
            localStorage.setItem('songsCacheTimestamp', Date.now().toString());

            setAllSongs(songsData);
        } catch (error) {
            console.error("Error fetching songs:", error);
            setError("Failed to load songs. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    // Group songs by genre using useMemo for efficiency
    const songsByGenre = useMemo(() => {
        const grouped: Record<string, Song[]> = {};
        allSongs.forEach((song) => {
            if (!grouped[song.genre]) {
                grouped[song.genre] = [];
            }
            grouped[song.genre].push(song);
        });
        return grouped;
    }, [allSongs]);

    const genres = useMemo(() => Object.keys(songsByGenre), [songsByGenre]);

    // Calculate songs to display based on active tab and current page
    const { currentSongs, totalPages } = useMemo(() => {
        const sourceSongs = activeTab === "all" ? allSongs : songsByGenre[activeTab] || [];
        const total = sourceSongs.length;
        const pages = Math.ceil(total / ITEMS_PER_PAGE);
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        const songsForPage = sourceSongs.slice(startIndex, endIndex);

        return { currentSongs: songsForPage, totalPages: pages };
    }, [activeTab, currentPage, allSongs, songsByGenre]);

    // Handlers for pagination
    const handlePageChange = (page: number) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo(0, 0); // Scroll to top on page change
        }
    };

    const handleTabChange = (value: string) => {
        setActiveTab(value);
        setCurrentPage(1); // Reset to first page when tab changes
    };

    // Function to render song cards or skeletons
    const renderSongGrid = (songsToRender: Song[]) => (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {loading ? (
                Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
                    <SongCardSkeleton key={`skeleton-${index}`} />
                ))
            ) : songsToRender.length > 0 ? (
                songsToRender.map((song) => (
                    <SongCard
                        key={song.id}
                        id={song.id}
                        title={song.title}
                        artist={song.artist}
                        album={song.album}
                        coverImage={song.imageUrl || "/placeholder.svg"}
                        duration={song.duration}
                        genre={song.genre}
                        lyrics={song.lyrics} // Pass lyrics if needed by SongCard details view
                    />
                ))
            ) : (
                <p className="col-span-full text-center text-muted-foreground">
                    No songs found {activeTab !== 'all' ? `in the ${activeTab} genre` : ''}.
                </p>
            )}
        </div>
    );

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">All Songs</h1>
                <p className="mt-2 text-muted-foreground">
                    Browse our collection of song lyrics from various artists and genres.
                </p>
            </div>

            {error ? (
                <div className="text-red-500">{error}</div>
            ) : (
                <>
                    <Tabs
                        defaultValue="all"
                        className="w-full"
                        value={activeTab} // Control the active tab state
                        onValueChange={handleTabChange} // Handle tab changes
                    >
                        <TabsList className="mb-6 w-full justify-start overflow-auto">
                            <TabsTrigger value="all" className="rounded-[4px]">
                                All
                            </TabsTrigger>
                            {/* Only render genre tabs if not loading and genres exist */}
                            {!loading && genres.map((genre) => (
                                <TabsTrigger key={genre} value={genre} className="rounded-[4px]">
                                    {genre}
                                </TabsTrigger>
                            ))}
                            {/* Show skeleton tabs while loading */}
                            {loading && Array.from({ length: 4 }).map((_, i) => (
                                <Skeleton key={`tab-skel-${i}`} className="h-10 w-20 rounded-[4px] mr-2" />
                            ))}
                        </TabsList>

                        {/* Content for "All" tab */}
                        <TabsContent value="all" className="mt-0">
                            {renderSongGrid(currentSongs)}
                        </TabsContent>

                        {/* Content for each Genre tab */}
                        {genres.map((genre) => (
                            <TabsContent key={genre} value={genre} className="mt-0">
                                {renderSongGrid(currentSongs)}
                            </TabsContent>
                        ))}
                    </Tabs>

                    {/* Pagination - Render only if not loading and there's more than one page */}
                    {!loading && totalPages > 1 && (
                        <Pagination className="mt-8">
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        href="#" // Use href="#" or preventDefault if routing isn't needed
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handlePageChange(currentPage - 1);
                                        }}
                                        aria-disabled={currentPage === 1}
                                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                                    />
                                </PaginationItem>

                                {/* Basic Page Number Display (can be enhanced) */}
                                {currentPage > 1 && (
                                    <PaginationItem>
                                        <PaginationLink
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handlePageChange(1);
                                            }}
                                        >
                                            1
                                        </PaginationLink>
                                    </PaginationItem>
                                )}
                                {currentPage > 2 && <PaginationItem><PaginationEllipsis /></PaginationItem>}


                                <PaginationItem>
                                    <PaginationLink href="#" isActive>
                                        {currentPage}
                                    </PaginationLink>
                                </PaginationItem>

                                {currentPage < totalPages - 1 && <PaginationItem><PaginationEllipsis /></PaginationItem>}
                                {currentPage < totalPages && (
                                    <PaginationItem>
                                        <PaginationLink
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handlePageChange(totalPages);
                                            }}
                                        >
                                            {totalPages}
                                        </PaginationLink>
                                    </PaginationItem>
                                )}


                                <PaginationItem>
                                    <PaginationNext
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handlePageChange(currentPage + 1);
                                        }}
                                        aria-disabled={currentPage === totalPages}
                                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    )}
                </>
            )}
        </div>
    );
};

export default SongListClient;