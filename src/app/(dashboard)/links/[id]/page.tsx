import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";
import { AnalyticsView } from "@/components/analytics/analytics-view";
import { Header } from "@/components/dashboard/header";
import { Button } from "@/components/ui/button";
import { getCachedClickCount } from "@/lib/redis/cache";
import { createClient } from "@/lib/supabase/server";

export default async function AnalyticsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const linkId = parseInt(id, 10);

    if (Number.isNaN(linkId)) {
        return <div>Invalid Link ID</div>;
    }

    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null; // Handled by root layout auth check

    // Fetch link details
    const { data: links, error } = await supabase
        .from("links")
        .select("*")
        .eq("id", linkId)
        .limit(1);

    if (error || !links || links.length === 0) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-4">
                <p className="text-muted-foreground">Link not found.</p>
                <Button
                    render={
                        <Link href="/">
                            <IconArrowLeft data-icon="inline-start" />
                            Back to Dashboard
                        </Link>
                    }
                    variant="outline"
                    nativeButton={false}
                />
            </div>
        );
    }

    const link = links[0];
    const totalClicks = Math.max(
        Number(link.click_count ?? 0),
        (await getCachedClickCount(linkId)) ?? 0,
    );

    return (
        <div className="min-h-screen">
            <Header email={user.email ?? ""} />

            <main className="mx-auto max-w-5xl px-6 py-8">
                <div className="mb-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <Link
                            href="/"
                            className="mb-2 inline-flex items-center text-muted-foreground text-sm hover:text-foreground"
                        >
                            <IconArrowLeft className="mr-1 size-4" />
                            Back to links
                        </Link>
                        <h2 className="font-semibold text-2xl tracking-tight">
                            /{link.slug} Analytics
                        </h2>
                        <a
                            href={link.original_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="truncate text-muted-foreground hover:text-foreground"
                        >
                            {link.original_url}
                        </a>
                    </div>
                </div>

                <AnalyticsView linkId={linkId} totalClicks={totalClicks} />
            </main>
        </div>
    );
}
