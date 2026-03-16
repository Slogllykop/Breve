"use client";

import {
    IconActivityHeartbeat,
    IconBarcode,
    IconCheck,
    IconCopy,
    IconDownload,
    IconExternalLink,
    IconLoader2,
    IconMapPin,
    IconMouse,
    IconPencil,
    IconTrash,
    IconTrendingUp,
} from "@tabler/icons-react";
import { useRef, useState } from "react";
import type { LinkData } from "@/app/(dashboard)/actions";
import { DeleteLinkDialog } from "@/components/dashboard/delete-link-dialog";
import { EditLinkDialog } from "@/components/dashboard/edit-link-dialog";
import { QrCode } from "@/components/dashboard/qr-code";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { type Period, useAnalytics } from "@/hooks/use-analytics";
import { ClickChart } from "./click-chart";
import { CountryChart } from "./country-chart";
import { DeviceChart } from "./device-chart";

type AnalyticsViewProps = {
    linkId: number;
    totalClicks: number;
    link: LinkData;
    baseUrl: string;
};

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
    const [copied, setCopied] = useState(false);
    const qrRef = useRef<HTMLCanvasElement>(null);

    const shortUrl = `${baseUrl}/${link.slug}`;

    const periodClicks = data
        ? data.timeSeries.reduce((acc, curr) => acc + curr.clicks, 0)
        : 0;
    const activeDays =
        data?.timeSeries.filter((item) => item.clicks > 0).length ?? 0;
    const avgPerActiveDay =
        activeDays > 0 ? Math.round((periodClicks / activeDays) * 10) / 10 : 0;

    const topDevice = data?.devices.reduce(
        (prev, current) => (prev.clicks > current.clicks ? prev : current),
        { device_type: "N/A", clicks: 0 },
    );

    const topCountry = data?.countries.reduce(
        (prev, current) => (prev.clicks > current.clicks ? prev : current),
        { country: "N/A", clicks: 0 },
    );

    async function handleCopy() {
        await navigator.clipboard.writeText(shortUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    function downloadQrCode() {
        const canvas = qrRef.current;
        if (!canvas) return;

        const objectUrl = canvas.toDataURL("image/png");
        const anchor = document.createElement("a");
        anchor.href = objectUrl;
        anchor.download = `${link.slug}-qr.png`;
        anchor.click();
    }

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
                    <CardContent className="flex flex-col gap-5 p-5 sm:p-6">
                        <TooltipProvider>
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                <div className="flex items-center gap-4">
                                    <Tooltip>
                                        <TooltipTrigger
                                            render={
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setQrOpen(true)
                                                    }
                                                    className="group/qr relative shrink-0 cursor-pointer rounded-xl border border-white/10 bg-white p-0 shadow-[0_22px_40px_rgba(0,0,0,0.24)] transition-transform duration-200 hover:scale-105"
                                                >
                                                    <QrCode
                                                        ref={qrRef}
                                                        url={shortUrl}
                                                        size={64}
                                                        className="rounded-2xl"
                                                    />
                                                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-xl bg-black/50 opacity-0 transition-opacity group-hover/qr:opacity-100">
                                                        <IconBarcode className="size-4 text-white" />
                                                    </div>
                                                </button>
                                            }
                                        />
                                        <TooltipContent>
                                            View QR code
                                        </TooltipContent>
                                    </Tooltip>
                                    <div className="min-w-0">
                                        <h3 className="font-semibold text-2xl text-white tracking-tight">
                                            Analytics Overview
                                        </h3>
                                        <p className="mt-0.5 truncate text-sm text-white/56">
                                            {shortUrl}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Tabs
                                        value={period}
                                        onValueChange={(value) =>
                                            setPeriod(value as Period)
                                        }
                                        className="w-full sm:w-[320px]"
                                    >
                                        <TabsList className="grid w-full grid-cols-4 bg-black/28">
                                            <TabsTrigger value="7d">
                                                7D
                                            </TabsTrigger>
                                            <TabsTrigger value="30d">
                                                30D
                                            </TabsTrigger>
                                            <TabsTrigger value="90d">
                                                90D
                                            </TabsTrigger>
                                            <TabsTrigger value="all">
                                                All
                                            </TabsTrigger>
                                        </TabsList>
                                    </Tabs>

                                    {isLoading ? (
                                        <IconLoader2 className="size-5 animate-spin text-white/56" />
                                    ) : null}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap items-center gap-2 border-white/8 border-t pt-4">
                                <Tooltip>
                                    <TooltipTrigger
                                        render={
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="border-white/12 bg-white/4 text-white hover:bg-white/8"
                                                onClick={() => {
                                                    void handleCopy();
                                                }}
                                            >
                                                {copied ? (
                                                    <IconCheck data-icon="inline-start" />
                                                ) : (
                                                    <IconCopy data-icon="inline-start" />
                                                )}
                                                {copied
                                                    ? "Copied"
                                                    : "Copy short URL"}
                                            </Button>
                                        }
                                    />
                                    <TooltipContent>
                                        Copy the short link
                                    </TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                    <TooltipTrigger
                                        render={
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="border-white/12 bg-white/4 text-white hover:bg-white/8"
                                                onClick={downloadQrCode}
                                            >
                                                <IconDownload data-icon="inline-start" />
                                                Download QR
                                            </Button>
                                        }
                                    />
                                    <TooltipContent>
                                        Download QR code
                                    </TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                    <TooltipTrigger
                                        render={
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="border-white/12 bg-white/4 text-white hover:bg-white/8"
                                                nativeButton={false}
                                                render={
                                                    <a
                                                        href={shortUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <IconExternalLink data-icon="inline-start" />
                                                        Open short link
                                                    </a>
                                                }
                                            />
                                        }
                                    />
                                    <TooltipContent>
                                        Open link in new tab
                                    </TooltipContent>
                                </Tooltip>

                                <div className="ml-auto flex items-center gap-2">
                                    <Tooltip>
                                        <TooltipTrigger
                                            render={
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="border-white/12 bg-white/4 text-white hover:bg-white/8"
                                                    onClick={() =>
                                                        setEditOpen(true)
                                                    }
                                                >
                                                    <IconPencil data-icon="inline-start" />
                                                    Edit
                                                </Button>
                                            }
                                        />
                                        <TooltipContent>
                                            Edit link
                                        </TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                        <TooltipTrigger
                                            render={
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300"
                                                    onClick={() =>
                                                        setDeleteOpen(true)
                                                    }
                                                >
                                                    <IconTrash data-icon="inline-start" />
                                                    Delete
                                                </Button>
                                            }
                                        />
                                        <TooltipContent>
                                            Delete link
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                            </div>
                        </TooltipProvider>
                    </CardContent>
                </Card>

                {/* Stats Grid */}
                <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="col-span-1 row-span-2 flex flex-col justify-between rounded-[1.25rem] border border-white/10 bg-white/4 p-6 md:col-span-2">
                        <div>
                            <div className="flex items-center justify-between gap-3">
                                <p className="text-white/56 text-xs uppercase tracking-[0.18em]">
                                    All-time clicks
                                </p>
                                <div className="rounded-full border border-white/10 bg-white/6 p-2 text-white/72">
                                    <IconMouse className="size-4" />
                                </div>
                            </div>
                            <p className="mt-6 font-semibold text-5xl text-white tracking-tight lg:text-6xl">
                                {totalClicks.toLocaleString()}
                            </p>
                            <p className="mt-2 text-sm text-white/56">
                                Confirmed link visits
                            </p>
                        </div>
                    </div>

                    <div className="col-span-1 flex flex-col justify-between rounded-[1.25rem] border border-white/10 bg-white/4 p-5">
                        <div className="flex items-center justify-between gap-3">
                            <p className="text-white/56 text-xs uppercase tracking-[0.18em]">
                                Selected Period
                            </p>
                            <div className="rounded-full border border-white/10 bg-white/6 p-2 text-white/72">
                                <IconTrendingUp className="size-4" />
                            </div>
                        </div>
                        <div>
                            <p className="mt-4 font-semibold text-3xl text-white tracking-tight">
                                {periodClicks.toLocaleString()}
                            </p>
                            <p className="mt-1 text-sm text-white/56">
                                {period === "all"
                                    ? "All recorded history"
                                    : `Traffic in the last ${period}`}
                            </p>
                        </div>
                    </div>

                    <div className="col-span-1 flex flex-col justify-between rounded-[1.25rem] border border-white/10 bg-white/4 p-5">
                        <div className="flex items-center justify-between gap-3">
                            <p className="text-white/56 text-xs uppercase tracking-[0.18em]">
                                Top Device
                            </p>
                            <div className="rounded-full border border-white/10 bg-white/6 p-2 text-white/72">
                                <IconTrendingUp className="size-4" />
                            </div>
                        </div>
                        <div>
                            <p className="mt-4 font-semibold text-3xl text-white capitalize tracking-tight">
                                {topDevice?.device_type || "N/A"}
                            </p>
                            <p className="mt-1 text-sm text-white/56">
                                {topDevice?.clicks || 0} clicks
                            </p>
                        </div>
                    </div>

                    <div className="col-span-1 flex flex-col justify-between rounded-[1.25rem] border border-white/10 bg-white/4 p-5">
                        <div className="flex items-center justify-between gap-3">
                            <p className="text-white/56 text-xs uppercase tracking-[0.18em]">
                                Avg / Active Day
                            </p>
                            <div className="rounded-full border border-white/10 bg-white/6 p-2 text-white/72">
                                <IconActivityHeartbeat className="size-4" />
                            </div>
                        </div>
                        <div>
                            <p className="mt-4 font-semibold text-3xl text-white tracking-tight">
                                {avgPerActiveDay.toLocaleString()}
                            </p>
                            <p className="mt-1 text-sm text-white/56">
                                Across {activeDays} active days
                            </p>
                        </div>
                    </div>

                    <div className="col-span-1 mt-0 flex flex-col justify-between rounded-[1.25rem] border border-white/10 bg-white/4 p-5">
                        <div className="flex items-center justify-between gap-3">
                            <p className="text-white/56 text-xs uppercase tracking-[0.18em]">
                                Locations
                            </p>
                            <div className="rounded-full border border-white/10 bg-white/6 p-2 text-white/72">
                                <IconMapPin className="size-4" />
                            </div>
                        </div>
                        <div>
                            <p
                                className="mt-4 truncate font-semibold text-3xl text-white tracking-tight"
                                title={topCountry?.country || "N/A"}
                            >
                                {topCountry?.country || "N/A"}
                            </p>
                            <p className="mt-1 text-sm text-white/56">
                                {topCountry?.clicks || 0} clicks ·{" "}
                                {data?.countries.length ?? 0} countries total
                            </p>
                        </div>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Card className="col-span-1 border border-white/10 bg-white/4 lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Clicks over time</CardTitle>
                            <CardDescription>
                                Daily click volume across the selected window
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ClickChart data={data?.timeSeries ?? []} />
                        </CardContent>
                    </Card>

                    <Card className="col-span-1 border border-white/10 bg-white/4">
                        <CardHeader>
                            <CardTitle>Device Mix</CardTitle>
                            <CardDescription>
                                Mobile vs desktop traffic share
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <DeviceChart data={data?.devices ?? []} />
                        </CardContent>
                    </Card>

                    <Card className="col-span-1 border border-white/10 bg-white/4 lg:col-span-3">
                        <CardHeader>
                            <CardTitle>Top Locations</CardTitle>
                            <CardDescription>
                                Ranked by click volume for the selected period
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <CountryChart data={data?.countries ?? []} />
                        </CardContent>
                    </Card>
                </div>
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

            <Dialog open={qrOpen} onOpenChange={setQrOpen}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle className="font-mono text-sm">
                            /{link.slug}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-5 py-4">
                        <div className="mx-auto aspect-square w-full max-w-[260px] rounded-[1.5rem] bg-white p-5 text-black">
                            <QrCode
                                url={shortUrl}
                                size={220}
                                className="rounded-[1rem]"
                            />
                        </div>
                        <div className="space-y-2 text-center">
                            <p className="font-medium text-sm text-white">
                                This QR encodes the full absolute short URL.
                            </p>
                            <p className="truncate text-muted-foreground text-xs">
                                {shortUrl}
                            </p>
                        </div>
                        <Button className="w-full" onClick={downloadQrCode}>
                            <IconDownload data-icon="inline-start" />
                            Download PNG
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
