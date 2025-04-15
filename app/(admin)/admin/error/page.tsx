import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
    title: "Authentication Error | LyricVerse",
    description: "Authentication error occurred",
};

export default function AuthError() {
    return (
        <div className="container flex h-screen w-screen flex-col items-center justify-center">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                <div className="flex flex-col space-y-2 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight text-destructive">
                        Authentication Error
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        You are not authorized to access this area. Please contact the administrator.
                    </p>
                </div>
                <Button asChild variant="outline">
                    <Link href="/admin/login">
                        Return to Login
                    </Link>
                </Button>
            </div>
        </div>
    );
} 