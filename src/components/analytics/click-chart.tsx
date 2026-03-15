"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import type { TimeSeriesData } from "@/app/(dashboard)/links/[id]/actions";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

export function ClickChart({ data }: { data: TimeSeriesData[] }) {
    if (!data || data.length === 0) {
        return (
            <div className="flex h-[300px] w-full items-center justify-center text-muted-foreground text-sm">
                No click data available for this period.
            </div>
        );
    }

    return (
        <ChartContainer
            config={{
                clicks: {
                    label: "Clicks",
                    color: "hsl(var(--primary))",
                },
            }}
            className="h-[300px] w-full"
        >
            <BarChart
                data={data}
                margin={{ top: 20, right: 0, left: -20, bottom: 0 }}
            >
                <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="hsl(var(--border))"
                    opacity={0.5}
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
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                    tickFormatter={(value) => `${value}`}
                    className="fill-muted-foreground"
                />
                <ChartTooltip
                    cursor={{ fill: "hsl(var(--muted) / 0.5)" }}
                    content={<ChartTooltipContent />}
                />
                <Bar
                    dataKey="clicks"
                    fill="var(--color-clicks)"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={40}
                />
            </BarChart>
        </ChartContainer>
    );
}
