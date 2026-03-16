"use client";

import {
    Area,
    AreaChart,
    CartesianGrid,
    ReferenceLine,
    XAxis,
    YAxis,
} from "recharts";
import type { TimeSeriesData } from "@/app/(dashboard)/links/[id]/actions";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

export function ClickChart({ data }: { data: TimeSeriesData[] }) {
    if (!data || data.length === 0) {
        return (
            <div className="flex h-[320px] w-full items-center justify-center text-muted-foreground text-sm">
                No click data available for this period.
            </div>
        );
    }

    return (
        <ChartContainer
            config={{
                clicks: {
                    label: "Clicks",
                    color: "#10b981",
                },
            }}
            className="aspect-auto h-[320px] w-full"
        >
            <AreaChart
                data={data}
                margin={{ top: 20, right: 8, left: 0, bottom: 0 }}
            >
                <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="hsl(var(--border))"
                    opacity={0.35}
                />
                <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => {
                        const date = new Date(value);
                        return date.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                        });
                    }}
                    fontSize={12}
                    tickMargin={10}
                    className="fill-muted-foreground"
                />
                <YAxis
                    allowDecimals={false}
                    tickLine={false}
                    axisLine={false}
                    width={34}
                    fontSize={12}
                    tickFormatter={(value) => `${value}`}
                    className="fill-muted-foreground"
                />
                <ReferenceLine y={0} stroke="hsl(var(--border))" />
                <ChartTooltip
                    cursor={false}
                    content={
                        <ChartTooltipContent
                            labelFormatter={(label: string) =>
                                new Date(label).toLocaleDateString("en-US", {
                                    weekday: "short",
                                    month: "short",
                                    day: "numeric",
                                })
                            }
                        />
                    }
                />
                <Area
                    type="monotone"
                    dataKey="clicks"
                    fill="var(--color-clicks)"
                    fillOpacity={0.2}
                    stroke="var(--color-clicks)"
                    strokeWidth={2.5}
                />
            </AreaChart>
        </ChartContainer>
    );
}
