"use client";

import {
    Bar,
    BarChart,
    CartesianGrid,
    LabelList,
    XAxis,
    YAxis,
} from "recharts";
import type { CountryData } from "@/app/(dashboard)/links/[id]/actions";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

export function CountryChart({ data }: { data: CountryData[] }) {
    if (!data || data.length === 0) {
        return (
            <div className="flex h-[320px] w-full items-center justify-center text-muted-foreground text-sm">
                No location data available.
            </div>
        );
    }

    const sortedData = [...data]
        .sort((a, b) => b.clicks - a.clicks)
        .slice(0, 10);

    return (
        <ChartContainer
            config={{
                clicks: {
                    label: "Clicks",
                    color: "rgba(255,255,255,0.88)",
                },
            }}
            className="aspect-auto h-[320px] w-full"
        >
            <BarChart
                data={sortedData}
                layout="vertical"
                margin={{ top: 0, right: 12, left: 0, bottom: 0 }}
            >
                <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={false}
                    vertical={false}
                    stroke="hsl(var(--border))"
                    opacity={0.35}
                />
                <XAxis type="number" hide allowDecimals={false} />
                <YAxis
                    dataKey="country"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    className="fill-muted-foreground font-medium"
                    fontSize={12}
                    width={92}
                />
                <ChartTooltip
                    cursor={{ fill: "hsl(var(--muted) / 0.35)" }}
                    content={
                        <ChartTooltipContent
                            labelFormatter={(label: string) =>
                                label === "unknown" ? "Unknown" : String(label)
                            }
                        />
                    }
                />
                <Bar
                    dataKey="clicks"
                    fill="var(--color-clicks)"
                    radius={[0, 4, 4, 0]}
                    barSize={24}
                >
                    <LabelList
                        dataKey="clicks"
                        position="right"
                        className="fill-foreground font-mono text-xs"
                    />
                </Bar>
            </BarChart>
        </ChartContainer>
    );
}
