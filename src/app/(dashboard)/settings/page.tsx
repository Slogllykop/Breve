import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";
import { getWhitelistedEmails } from "@/app/(dashboard)/settings/actions";
import { LoginForm } from "@/components/auth/login-form";
import { Header } from "@/components/dashboard/header";
import { WhitelistManager } from "@/components/settings/whitelist-manager";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

export default async function SettingsPage() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return <LoginForm />;
    }

    const emails = await getWhitelistedEmails();

    return (
        <div className="flex min-h-screen flex-col bg-black">
            <Header email={user.email ?? ""} />
            <main className="mx-auto w-full max-w-5xl flex-1 p-4 md:p-8">
                <div className="mb-8">
                    <Link
                        href="/"
                        className="mb-4 inline-flex items-center text-sm text-zinc-500 hover:text-zinc-300"
                    >
                        <IconArrowLeft className="mr-1 size-4" />
                        Back to links
                    </Link>
                    <h1 className="mb-2 font-bold text-3xl text-white tracking-tight">
                        Settings
                    </h1>
                    <p className="text-zinc-400">
                        Manage your account settings and preferences.
                    </p>
                </div>

                <div className="grid gap-6">
                    <Card className="border-zinc-800 bg-zinc-950">
                        <CardHeader>
                            <CardTitle className="text-white">
                                Whitelisted Emails
                            </CardTitle>
                            <CardDescription className="text-zinc-400">
                                Emails in this list are allowed to access and
                                manage the dashboard.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <WhitelistManager initialEmails={emails} />
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
