import type { NextAuthOptions, DefaultSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { db, storage } from "@/lib/firebase/config";
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import type { AdminUser } from "@/types";

const sanitizeEmailForPath = (email: string) =>
  email.replace(/[^a-zA-Z0-9]/g, "_");

const getExtensionFromMimeType = (mimeType: string | null): string => {
  if (!mimeType) return "jpg";
  switch (mimeType.toLowerCase()) {
    case "image/jpeg":
    case "image/jpg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/gif":
      return "gif";
    default:
      return "jpg";
  }
};

declare module "next-auth" {
  interface Session {
    user: {
      isAdmin?: boolean;
      email?: string | null;
      name?: string | null;
      image?: string | null;
    } & Omit<DefaultSession["user"], "name" | "image" | "email">;
  }
}

async function uploadAdminImage(
  googleImageUrl: string,
  adminEmail: string
): Promise<string | null> {
  if (!googleImageUrl) return null;

  try {
    const response = await fetch(googleImageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    const contentType = response.headers.get("content-type");
    const extension = getExtensionFromMimeType(contentType);
    const imageBuffer = await response.arrayBuffer();

    const sanitizedEmail = sanitizeEmailForPath(adminEmail);
    const storagePath = `admin_profiles/${sanitizedEmail}/profile.${extension}`;
    const storageRef = ref(storage, storagePath);

    const snapshot = await uploadBytes(storageRef, imageBuffer, {
      contentType: contentType || "image/jpeg",
    });

    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    return null;
  }
}

async function ensureAdminUserExists(
  email: string,
  name?: string | null,
  googleImageUrl?: string | null
) {
  if (email !== process.env.ADMIN_EMAIL) {
    return;
  }

  const userDocRef = doc(db, "users", email);
  let imageUrlToStore: string | null | undefined = undefined;

  try {
    const userDocSnap = await getDoc(userDocRef);
    const existingData = userDocSnap.data() as AdminUser | undefined;
    const needsImageUpdate =
      googleImageUrl &&
      (!existingData?.image || existingData.image !== googleImageUrl);

    if (needsImageUpdate) {
      imageUrlToStore = await uploadAdminImage(googleImageUrl, email);
      if (imageUrlToStore === null) {
        imageUrlToStore = existingData?.image ?? undefined;
      }
    } else {
      imageUrlToStore = existingData?.image ?? googleImageUrl ?? undefined;
    }

    const userData: Partial<AdminUser> = {
      email: email,
      name: name ?? existingData?.name ?? undefined,
      image: imageUrlToStore,
      isAdmin: true,
      lastLogin: serverTimestamp() as Timestamp,
      ...(!existingData && { contributions: [] }),
    };

    await setDoc(userDocRef, userData, { merge: true });
  } catch (error) {}
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/admin/error",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        const userEmail = profile?.email || user?.email;

        if (!userEmail) {
          return "/admin/error?error=EmailNotFound";
        }

        if (userEmail === process.env.ADMIN_EMAIL) {
          await ensureAdminUserExists(
            userEmail,
            profile?.name,
            (profile as any)?.picture ?? user?.image
          );
          return true;
        } else {
          return "/admin/error?error=AccessDenied";
        }
      }
      return "/admin/error?error=InvalidProvider";
    },

    async jwt({ token, user, profile }) {
      if (user) {
        token.email = user.email;
        token.isAdmin = user.email === process.env.ADMIN_EMAIL;
        if (profile) {
          token.name = profile.name;
          token.picture = (profile as any).picture ?? user.image;
        } else if (user) {
          token.name = user.name;
          token.picture = user.image;
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.email = token.email as string;
        session.user.isAdmin = token.isAdmin as boolean;
        session.user.name = token.name as string | null | undefined;
        session.user.image = token.picture as string | null | undefined;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
