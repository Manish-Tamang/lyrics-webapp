"use client";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { GoogleSignInButton } from './google-signin-button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default async function AdminLoginPage({ searchParams }: { searchParams: { callbackUrl?: string } }) {
    const session = await auth();

    if (session) {
        redirect(searchParams.callbackUrl || "/admin");
    }

    return (
        <div className="container flex h-screen w-screen flex-col items-center justify-center">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl text-center">Admin Login</CardTitle>
                    <CardDescription className="text-center">
                        Sign in to access the admin dashboard
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <GoogleSignInButton callbackUrl={searchParams.callbackUrl} />
                </CardContent>
            </Card>
        </div>
    );
}