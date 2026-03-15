import { getWhitelistedEmails } from "@/app/(dashboard)/settings/actions";
import { LoginForm } from "@/components/auth/login-form";
import { Header } from "@/components/dashboard/header";
import { AddEmailForm } from "@/components/settings/add-email-form";
import { EmailList } from "@/components/settings/email-list";
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
                            <AddEmailForm emails={emails} />
                            <EmailList initialEmails={emails} />
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
