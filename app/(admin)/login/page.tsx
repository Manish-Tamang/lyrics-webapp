import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { GoogleSignInButton } from './google-signin-button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default async function AdminLoginPage({ searchParams }: { searchParams: { callbackUrl?: string } }) {
    const session = await auth();

    if (session?.user?.isAdmin) {
        redirect(searchParams.callbackUrl || "/admin");
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