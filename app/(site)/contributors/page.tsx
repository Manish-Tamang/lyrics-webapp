import type { Metadata } from "next";
import { db } from "@/lib/firebase/config";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
export const metadata: Metadata = {
  title: "Contributors | LyricVerse",
  description:
    "Meet our amazing contributors who help build the largest lyrics database",
};

interface Contributor {
  email: string;
  name: string;
  imageUrl?: string;
  contributions: string[];
  lastContribution?: Date;
}

async function getContributors(): Promise<Contributor[]> {
  try {
    // Get all songs to count contributions
    const songsQuery = query(collection(db, "songs"));
    const songsSnapshot = await getDocs(songsQuery);

    // Create a map to store contributor data
    const contributorMap = new Map<string, Contributor>();

    // Process songs to count contributions
    songsSnapshot.forEach((doc) => {
      const songData = doc.data();

      // Add main contributor
      if (songData.contributedByEmail) {
        const email = songData.contributedByEmail;
        if (!contributorMap.has(email)) {
          contributorMap.set(email, {
            email,
            name: songData.contributedByName || "Anonymous",
            imageUrl: songData.contributedByImage,
            contributions: [],
            lastContribution: songData.createdAt?.toDate(),
          });
        }
        const contributor = contributorMap.get(email)!;
        contributor.contributions.push(doc.id);
        if (
          songData.createdAt?.toDate() >
          (contributor.lastContribution || new Date(0))
        ) {
          contributor.lastContribution = songData.createdAt.toDate();
        }
      }

      // Add additional contributors
      if (songData.contributors) {
        songData.contributors.forEach((contributorEmail: string) => {
          if (contributorEmail !== songData.contributedByEmail) {
            if (!contributorMap.has(contributorEmail)) {
              contributorMap.set(contributorEmail, {
                email: contributorEmail,
                name: contributorEmail.split("@")[0], // Extract name from email
                contributions: [],
              });
            }
            const contributor = contributorMap.get(contributorEmail)!;
            contributor.contributions.push(doc.id);
          }
        });
      }
    });

    // Get user data to update names and images
    const usersQuery = query(collection(db, "users"));
    const usersSnapshot = await getDocs(usersQuery);

    usersSnapshot.forEach((doc) => {
      const userData = doc.data();
      const email = doc.id;
      if (contributorMap.has(email)) {
        const contributor = contributorMap.get(email)!;
        contributor.name = userData.name || contributor.name; // Keep the email-based name if no user name exists
        contributor.imageUrl = userData.image || contributor.imageUrl;
      }
    });

    // Convert map to array and sort by contribution count
    const contributors = Array.from(contributorMap.values()).sort(
      (a, b) => b.contributions.length - a.contributions.length
    );

    return contributors;
  } catch (error) {
    console.error("Error fetching contributors:", error);
    return [];
  }
}

export default async function ContributorsPage() {
  const contributors = await getContributors();

  return (
    <div className="space-y-8">
      <div className="border-b pb-6">
        <h1 className="text-3xl font-bold">Contributors</h1>
        <p className="mt-2 text-muted-foreground">
          Meet our amazing contributors who help build the largest lyrics
          database
        </p>
      </div>

      <div className="grid gap-6">
        {contributors.map((contributor, index) => (
          <Card key={contributor.email} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-muted-foreground">
                      #{index + 1}
                    </span>
                    {/* <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={contributor.imageUrl}
                        alt={contributor.name}
                      />
                      <AvatarFallback>
                        {contributor.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar> */}
                    <Image
                      src={contributor.imageUrl || "/placeholder.svg"}
                      alt={contributor.name}
                      width={48}
                      height={48}
                      className="rounded-full"
                      unoptimized
                      draggable={false}
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">
                      {contributor.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {contributor.contributions.length} songs contributed
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">
                    {contributor.contributions.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Songs</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {contributors.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No contributors found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
