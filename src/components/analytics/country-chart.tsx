"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import type { CountryData } from "@/app/(dashboard)/links/[id]/actions";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

export function CountryChart({ data }: { data: CountryData[] }) {
    if (!data || data.length === 0) {
        return (
            <div className="flex h-[300px] w-full items-center justify-center text-muted-foreground text-sm">
                No location data available.
            </div>
        );
    }

    // Sort descending and take top 10
    const sortedData = [...data]
        .sort((a, b) => b.clicks - a.clicks)
        .slice(0, 10);

    return (
        <ChartContainer
            config={{
                clicks: {
                    label: "Clicks",
                    color: "hsl(var(--chart-4))",
                },
            }}
            className="h-[300px] w-full"
        >
            <BarChart
                data={sortedData}
                layout="vertical"
                margin={{ top: 0, right: 0, left: 30, bottom: 0 }}
            >
                <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={true}
                    vertical={false}
                    stroke="hsl(var(--border))"
                    opacity={0.5}
                />
                <XAxis type="number" hide />
                <YAxis
                    dataKey="country"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    className="fill-muted-foreground font-medium uppercase"
                    fontSize={12}
                    width={50}
                />
                <ChartTooltip
                    cursor={{ fill: "hsl(var(--muted) / 0.5)" }}
                    content={<ChartTooltipContent />}
                />
                <Bar
                    dataKey="clicks"
                    fill="var(--color-clicks)"
                    radius={[0, 4, 4, 0]}
                    barSize={24}
                />
            </BarChart>
        </ChartContainer>
    );
}
