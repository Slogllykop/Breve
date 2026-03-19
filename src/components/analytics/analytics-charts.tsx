"use client";

import type { LinkAnalytics } from "@/app/(dashboard)/links/[id]/actions";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Period } from "@/hooks/use-analytics";
import { ClickChart } from "./click-chart";
import { CountryChart } from "./country-chart";
import { DeviceChart } from "./device-chart";

type AnalyticsChartsProps = {
    data: LinkAnalytics | null;
    isLoading: boolean;
    period?: Period;
};

/** Grid of analytics charts: clicks over time, device mix, and top locations. */
export function AnalyticsCharts({
    data,
    isLoading,
    period,
}: AnalyticsChartsProps) {
    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-1 border border-white/10 bg-white/4 lg:col-span-2">
                <CardHeader>
                    <CardTitle>Clicks over time</CardTitle>
                    <CardDescription>
                        Daily click volume across the selected window
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <Skeleton className="h-[300px] w-full bg-white/10" />
                    ) : (
                        <ClickChart
                            data={data?.timeSeries ?? []}
                            period={period}
                        />
                    )}
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
                    {isLoading ? (
                        <Skeleton className="h-[300px] w-full bg-white/10" />
                    ) : (
                        <DeviceChart data={data?.devices ?? []} />
                    )}
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
                    {isLoading ? (
                        <Skeleton className="h-[300px] w-full bg-white/10" />
                    ) : (
                        <CountryChart data={data?.countries ?? []} />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
