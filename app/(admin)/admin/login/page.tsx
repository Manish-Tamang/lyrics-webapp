import { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import LoginForm from "./login-form";

export const metadata: Metadata = {
    title: "Admin Login | LyricVerse",
    description: "Login to access the admin dashboard",
};

export default async function AdminLoginPage() {
    const session = await auth();

    if (session) {
        redirect("/admin");
    }

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="w-full max-w-md p-8 space-y-8 bg-card rounded-lg shadow-lg">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">
                        Welcome to Admin Panel
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Sign in with your Google account to access the admin dashboard
                    </p>
                </div>
                <LoginForm />
            </div>
        </div>
    );
} 