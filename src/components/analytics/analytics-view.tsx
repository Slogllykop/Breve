"use client";

import {
    IconDeviceMobile,
    IconLoader2,
    IconMapPin,
    IconMouse,
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
            <div className="flex items-center justify-between">
                <Tabs
                    value={period}
                    onValueChange={(v) => setPeriod(v as Period)}
                    className="w-[320px]"
                >
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="7d">7D</TabsTrigger>
                        <TabsTrigger value="30d">30D</TabsTrigger>
                        <TabsTrigger value="90d">90D</TabsTrigger>
                        <TabsTrigger value="all">All</TabsTrigger>
                    </TabsList>
                </Tabs>

                {isLoading && (
                    <IconLoader2 className="size-5 animate-spin text-muted-foreground" />
                )}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="font-medium text-sm">
                            Total Clicks
                        </CardTitle>
                        <IconMouse className="size-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="font-bold text-2xl">
                            {period === "all" ? totalClicks : periodClicks}
                        </div>
                        <p className="text-muted-foreground text-xs">
                            {period === "all" ? "All time" : `Last ${period}`}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="font-medium text-sm">
                            Top Device
                        </CardTitle>
                        <IconDeviceMobile className="size-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="font-bold text-2xl capitalize">
                            {topDevice?.device_type || "N/A"}
                        </div>
                        <p className="text-muted-foreground text-xs">
                            {topDevice?.clicks || 0} clicks
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="font-medium text-sm">
                            Top Location
                        </CardTitle>
                        <IconMapPin className="size-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="font-bold text-2xl">
                            {topCountry?.country || "N/A"}
                        </div>
                        <p className="text-muted-foreground text-xs">
                            {topCountry?.clicks || 0} clicks
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="col-span-1 lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Clicks over time</CardTitle>
                        <CardDescription>
                            Daily click volume for the selected period
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ClickChart data={data?.timeSeries ?? []} />
                    </CardContent>
                </Card>

                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Devices</CardTitle>
                        <CardDescription>Clicks by device type</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <DeviceChart data={data?.devices ?? []} />
                    </CardContent>
                </Card>

                <Card className="col-span-1 lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Locations</CardTitle>
                        <CardDescription>
                            Top countries by click volume
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
