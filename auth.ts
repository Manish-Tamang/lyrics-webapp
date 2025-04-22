import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session }) {
      if (session?.user?.email) {
        const adminEmails = process.env.ADMIN_EMAILS?.split(",") || [];
        session.user.isAdmin = adminEmails.includes(session.user.email);
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
export const auth = () => handler; 