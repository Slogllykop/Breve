"use client";

import {
    IconActivityHeartbeat,
    IconLoader2,
    IconMapPin,
    IconMouse,
    IconTrendingUp,
} from "@tabler/icons-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type Period, useAnalytics } from "@/hooks/use-analytics";
import { ClickChart } from "./click-chart";
import { CountryChart } from "./country-chart";
import { DeviceChart } from "./device-chart";

type AnalyticsViewProps = {
    linkId: number;
    totalClicks: number;
};

export function AnalyticsView({ linkId, totalClicks }: AnalyticsViewProps) {
    const { data, period, setPeriod, isLoading, error } = useAnalytics(linkId);

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

    if (error) {
        return (
            <div className="flex h-32 items-center justify-center rounded-lg border border-destructive/50 bg-destructive/10 text-destructive text-sm">
                {error}
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <Card className="border border-white/10 bg-white/4 py-0">
                <CardContent className="flex flex-col gap-6 p-5 sm:p-6">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <h3 className="font-semibold text-2xl text-white tracking-tight">
                            Analytics Overview
                        </h3>

                        <div className="flex items-center gap-3">
                            <Tabs
                                value={period}
                                onValueChange={(value) =>
                                    setPeriod(value as Period)
                                }
                                className="w-full sm:w-[320px]"
                            >
                                <TabsList className="grid w-full grid-cols-4 bg-black/28">
                                    <TabsTrigger value="7d">7D</TabsTrigger>
                                    <TabsTrigger value="30d">30D</TabsTrigger>
                                    <TabsTrigger value="90d">90D</TabsTrigger>
                                    <TabsTrigger value="all">All</TabsTrigger>
                                </TabsList>
                            </Tabs>

                            {isLoading ? (
                                <IconLoader2 className="size-5 animate-spin text-white/56" />
                            ) : null}
                        </div>
                    </div>
                </CardContent>
            </Card>

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
    );
}
