
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { GoogleSignInButton } from './google-signin-button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
    title: "Admin Login | LyricVerse",
    description: "Sign in with Google to access the admin dashboard",
};

export default async function AdminLoginPage() {
    const session = await auth();


    if (session?.user?.isAdmin) {
        redirect("/admin");
    }



    if (session && !session.user?.isAdmin) {


        redirect("/");
    }


    return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-muted">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="text-center space-y-2">
                    <CardTitle className="text-2xl font-bold tracking-tight">
                        Admin Panel Access
                    </CardTitle>
                    <CardDescription>
                        Sign in with your designated Google account below.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center pt-4">
                    <GoogleSignInButton />
                </CardContent>
            </Card>
        </div>
    );
}