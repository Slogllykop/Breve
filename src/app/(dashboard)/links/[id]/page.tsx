import { IconArrowLeft } from "@tabler/icons-react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { AnalyticsView } from "@/components/analytics/analytics-view";
import { Header } from "@/components/dashboard/header";
import { Button } from "@/components/ui/button";
import { getCachedClickCount } from "@/lib/redis/cache";
import { getLink } from "@/lib/supabase/links";
import { createClient } from "@/lib/supabase/server";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> {
    const { id } = await params;
    const linkId = parseInt(id, 10);

    if (Number.isNaN(linkId)) {
        return { title: "Invalid Link" };
    }

    const link = await getLink(linkId);

    if (!link) {
        return { title: "Link Not Found" };
    }
    const title = `${link.title} Analytics`;
    const description = `View detailed analytics and tracking information for "${link.title}" (${link.original_url}) on Breve.`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
    };
}

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

    const link = await getLink(linkId);

    if (!link) {
        return (
            <div className="flex min-h-dvh flex-col items-center justify-center gap-4">
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
    const totalClicks = Math.max(
        Number(link.click_count ?? 0),
        (await getCachedClickCount(linkId)) ?? 0,
    );

    // Derive base URL from request headers
    const headersList = await headers();
    const host = headersList.get("host") ?? "localhost:3000";
    const protocol = headersList.get("x-forwarded-proto") ?? "http";
    const baseUrl = `${protocol}://${host}`;

    return (
        <div className="min-h-dvh">
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
                            {link.title}
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

                <AnalyticsView
                    linkId={linkId}
                    totalClicks={totalClicks}
                    link={{
                        id: link.id,
                        slug: link.slug,
                        original_url: link.original_url,
                        title: link.title,
                        created_at: link.created_at,
                        updated_at: link.updated_at,
                        click_count: totalClicks,
                    }}
                    baseUrl={baseUrl}
                />
            </main>
        </div>
    );
}
