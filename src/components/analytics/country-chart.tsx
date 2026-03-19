"use client";

import {
    Bar,
    BarChart,
    CartesianGrid,
    LabelList,
    Rectangle,
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

    const BAR_COLORS = [
        "#10b981", // Emerald
        "#f59e0b", // Amber
        "#f43f5e", // Rose
        "#8b5cf6", // Violet
        "#f97316", // Orange
        "#06b6d4", // Cyan (switching to cyan/teal as it's distinct from forbidden 'blue')
        "#ec4899", // Pink
        "#84cc16", // Lime
        "#d946ef", // Fuchsia
        "#6366f1", // Indigo
    ];

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
            <BarChart
                data={sortedData}
                layout="vertical"
                margin={{ top: 5, right: 45, left: 10, bottom: 5 }}
                className="outline-0"
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
                    width={120}
                    interval={0}
                />
                <ChartTooltip
                    cursor={{ fill: "hsl(var(--muted) / 0.15)" }}
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
                    radius={[0, 4, 4, 0]}
                    barSize={20}
                    // biome-ignore lint/suspicious/noExplicitAny: Recharts custom shape props receive dynamic SVG attributes.
                    shape={(props: any) => {
                        return (
                            <Rectangle
                                {...props}
                                fill={BAR_COLORS[props.index % BAR_COLORS.length]}
                            />
                        );
                    }}
                >
                    <LabelList
                        dataKey="clicks"
                        position="right"
                        className="fill-foreground/80 font-mono text-xs"
                        offset={10}
                    />
                </Bar>
            </BarChart>
        </ChartContainer>
    );
}
