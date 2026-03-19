"use client";

import { useState } from "react";
import type { LinkData } from "@/app/(dashboard)/actions";
import { DeleteLinkDialog } from "@/components/dashboard/delete-link-dialog";
import { EditLinkDialog } from "@/components/dashboard/edit-link-dialog";
import { QrDialog } from "@/components/dashboard/qr-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { type Period, useAnalytics } from "@/hooks/use-analytics";
import { AnalyticsActionBar } from "./analytics-action-bar";
import { AnalyticsCharts } from "./analytics-charts";
import { AnalyticsStatsGrid } from "./analytics-stats-grid";

type AnalyticsViewProps = {
    linkId: number;
    totalClicks: number;
    link: LinkData;
    baseUrl: string;
};

/**
 * Main analytics view composed of action bar, stats grid, and charts.
 * Each section is a separate component for maintainability.
 */
export function AnalyticsView({
    linkId,
    totalClicks,
    link,
    baseUrl,
}: AnalyticsViewProps) {
    const { data, period, setPeriod, isLoading, error } = useAnalytics(linkId);

    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [qrOpen, setQrOpen] = useState(false);

    const shortUrl = `${baseUrl}/${link.slug}`;

    if (error) {
        return (
            <div className="flex h-32 items-center justify-center rounded-lg border border-destructive/50 bg-destructive/10 text-destructive text-sm">
                {error}
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-col gap-6">
                {/* Action Bar */}
                <Card className="border border-white/10 bg-white/4 py-0">
                    <CardContent className="flex flex-col gap-5 p-4 sm:p-6">
                        <AnalyticsActionBar
                            link={link}
                            shortUrl={shortUrl}
                            period={period}
                            onPeriodChange={(p: Period) => setPeriod(p)}
                            onEditOpen={() => setEditOpen(true)}
                            onDeleteOpen={() => setDeleteOpen(true)}
                            onQrOpen={() => setQrOpen(true)}
                        />
                    </CardContent>
                </Card>

                {/* Stats Grid */}
                <AnalyticsStatsGrid
                    totalClicks={totalClicks}
                    data={data}
                    period={period}
                    isLoading={isLoading}
                />

                {/* Charts */}
                <AnalyticsCharts
                    data={data}
                    isLoading={isLoading}
                    period={period}
                />
            </div>

            <EditLinkDialog
                link={link}
                open={editOpen}
                onOpenChange={setEditOpen}
            />

            <DeleteLinkDialog
                linkId={link.id}
                slug={link.slug}
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
            />

            <QrDialog
                slug={link.slug}
                shortUrl={shortUrl}
                open={qrOpen}
                onOpenChange={setQrOpen}
            />
        </>
    );
}
