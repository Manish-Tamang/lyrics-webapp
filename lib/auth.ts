// lib/auth.ts
import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import type { User, JWT } from "next-auth"

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials): Promise<User | null> {
                if (!credentials?.email || !credentials?.password) {
                    return null
                }

                // Check if the email matches the admin email
                if (credentials.email !== process.env.ADMIN_EMAIL) {
                    return null
                }

                // In a real app, you would verify the password here
                // For this example, we'll just check if it's not empty
                if (!credentials.password) {
                    return null
                }

                return {
                    id: "1",
                    email: credentials.email,
                    name: "Admin"
                }
            }
        })
    ],
    pages: {
        signIn: "/admin/login"
    },
    callbacks: {
        async jwt({ token, user }: { token: JWT; user: User | null }) {
            if (user) {
                token.email = user.email
            }
            return token
        },
        async session({ session, token }: { session: any; token: JWT }) {
            if (token) {
                session.user.email = token.email
            }
            return session
        }
    }
}